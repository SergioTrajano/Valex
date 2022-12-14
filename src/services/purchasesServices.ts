import dayjs from "dayjs";
import { compareSync } from "bcrypt";
import Cryptr from "cryptr";
import { faker } from "@faker-js/faker";

import * as generateCardData from "../utils/generateCardData";
import { decryptSecurityCode } from "../utils/securityCodeEncrypter";
import { comparePasswords } from "../utils/passwordENcrypter";
import { findById as findBusinessById } from "../repositories/businessRepository";
import { findById as findCardById, findByCardDetails } from "../repositories/cardRepository";
import { findByCardId as findTransactionsByCardId } from "../repositories/paymentRepository";
import { findByCardId as findRechargesByCardId } from "../repositories/rechargeRepository";
import { notFoundError, ActivatedCardError, expirateCardError, invalidCVC } from "../utils/errorGenerators";
import { insert } from "../repositories/paymentRepository";

export async function addPurchaseService(cardId: number, password: string, businessId: number, amount: number) {
    const dbCard = await findCardById(cardId);
    const dbBusiness = await findBusinessById(businessId);

    if (!dbCard) throw notFoundError("card");
    if (!dbCard.password) throw ActivatedCardError();
    if (dbCard.isVirtual) throw { type: "anathorized", message: "VirtualCards can not be used to purchases"};
    if (dayjs(dbCard.expirationDate.split("/")[0]+"/01/"+dbCard.expirationDate.split("/")[1]).diff(dayjs(), "month") < 0) throw expirateCardError();
    if (dbCard.isBlocked) throw { type: "invalid_card", message: "Card is blocked"};
    if (!comparePasswords(dbCard.password, password)) throw { type: "invalid_password", message: "Invalid credentials!"};
    if (!dbBusiness) throw {type: "Invalid_business", message: "anathourized_business"};
    if (dbBusiness.type !== dbCard.type) throw { type: "invalid_purchaseType", message: "CardType is not valid to purchase in passed Business"};

    const cardTransactions = await findTransactionsByCardId(cardId);
    const cardRecharges = await findRechargesByCardId(cardId);

    const balance: number = generateCardData.generateBalance(cardRecharges, cardTransactions);

    if (balance < amount) throw {type: "insufficient funds", message: "Card has insufficient funds"};

    await insert({
        cardId,
        businessId,
        amount
    });

    return balance - amount;
}

export async function addOnlinePurchaseService(number: string, name: string, expirationDate: string, securityCode: string, businessId: number, amount: number) {
    const dbCard = await findByCardDetails(number, name);
    const dbBusiness = await findBusinessById(businessId);
    
    if (!dbCard || expirationDate !== dayjs(dbCard.expirationDate).format("MM/YY")) throw notFoundError("card");
    if (decryptSecurityCode(dbCard.securityCode) !== securityCode) throw invalidCVC();
    if (dayjs(dbCard.expirationDate.split("/")[0]+"/01/"+dbCard.expirationDate.split("/")[1]).diff(dayjs(), "month") < 0) throw expirateCardError();
    if (dbCard.isBlocked) throw { type: "invalid_card", message: "Card is blocked"};
    if (!dbBusiness) throw {type: "Invalid_business", message: "anathourized_business"};
    if (dbBusiness.type !== dbCard.type) throw { type: "invalid_purchaseType", message: "CardType is not valid to purchase in passed Business"};

    const cardTransactions = await findTransactionsByCardId(dbCard.isVirtual ? dbCard.originalCardId || 0 : dbCard.id);
    const cardRecharges = await findRechargesByCardId(dbCard.isVirtual ? dbCard.originalCardId || 0 : dbCard.id);

    const balance: number = generateCardData.generateBalance(cardRecharges, cardTransactions);

    if (balance < amount) throw {type: "insufficient funds", message: "Card has insufficient funds"};

    await insert({
        cardId: dbCard.isVirtual ? dbCard.originalCardId || 0 : dbCard.id,
        businessId,
        amount
    });

    return balance - amount;
}