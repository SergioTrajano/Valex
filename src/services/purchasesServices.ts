import dayjs from "dayjs";
import { compareSync } from "bcrypt";
import Cryptr from "cryptr";
import { faker } from "@faker-js/faker";

import { findById as findBusinessById } from "../repositories/businessRepository";
import { findById as findCardById, findByCardDetails } from "../repositories/cardRepository";
import { findByCardId as findTransactionsByCardId } from "../repositories/paymentRepository";
import { findByCardId as findRechargesByCardId } from "../repositories/rechargeRepository";
import { notFoundError, ActivatedCardError, expirateCardError, invalidCVC } from "../utils/errorGenerators";
import { insert } from "../repositories/paymentRepository";

//refatorar com função do cardServices
function comparePasswords(dbPassword: string , password: string) {
    return compareSync(password, dbPassword);
}

function encrypter() {
    const CRYPTR_KEY: string = process.env.CRYPTR_KEY || "valex";
    const cryptr = new Cryptr(CRYPTR_KEY);

    return cryptr;
}

function encryptedSecurityCode(cryptr: Cryptr) {
    const securityCode = faker.finance.creditCardCVV();

    return cryptr.encrypt(securityCode);
}

function decryptedSecurityCode(cryptr: Cryptr, dbSecurityCode: string) {
    const decryptedCVC = cryptr.decrypt(dbSecurityCode);

    return decryptedCVC; 
}

export async function addPurchaseService(cardId: number, password: string, businessId: number, amount: number) {
    const dbCard = await findCardById(cardId);
    const dbBusiness = await findBusinessById(businessId);

    if (!dbCard) throw notFoundError("card");
    if (!dbCard.password) throw ActivatedCardError();
    if (dayjs(dbCard.expirationDate).diff(dayjs()) < 0) throw expirateCardError();
    if (dbCard.isBlocked) throw { type: "invalid_card", message: "Card is blocked"};
    if (!comparePasswords(password, dbCard.password)) throw { type: "invalid_password", message: "Invalid credentials!"};
    if (!dbBusiness) throw {type: "Invalid_business", message: "anathourized_business"};
    if (dbBusiness.type !== dbCard.type) throw { type: "invalid_purchaseType", message: "CardType is not valid to purchase in passed Business"};

    //refatorar com a função em cardServices
    const cardTransactions = await findTransactionsByCardId(cardId);
    const cardRecharges = await findRechargesByCardId(cardId);

    const balance: number = cardRecharges.reduce((total, curr) => {return total += curr.amount}, 0) - cardTransactions.reduce((total, curr) => { return total += curr.amount}, 0);

    if (balance < amount) throw {type: "insufficient funds", message: "Card has insufficient funds"};

    await insert({cardId, businessId, amount});

    return balance - amount;
}

export async function addOnlinePurchaseService(number: string, name: string, expirationDate: string, securityCode: string, businessId: number, amount: number) {
    const dbCard = await findByCardDetails(number, name);
    const dbBusiness = await findBusinessById(businessId);
    
    if (!dbCard || expirationDate !== dayjs(dbCard.expirationDate).format("MM/YY")) throw notFoundError("card");
    if (decryptedSecurityCode(encrypter(), dbCard.securityCode) !== securityCode) throw invalidCVC();
    if (dayjs(dbCard.expirationDate).diff(dayjs()) < 0) throw expirateCardError();
    if (dbCard.isBlocked) throw { type: "invalid_card", message: "Card is blocked"};
    if (!dbBusiness) throw {type: "Invalid_business", message: "anathourized_business"};
    if (dbBusiness.type !== dbCard.type) throw { type: "invalid_purchaseType", message: "CardType is not valid to purchase in passed Business"};

    //refatorar com a função em cardServices
    const cardTransactions = await findTransactionsByCardId(dbCard.id);
    const cardRecharges = await findRechargesByCardId(dbCard.id);

    const balance: number = cardRecharges.reduce((total, curr) => {return total += curr.amount}, 0) - cardTransactions.reduce((total, curr) => { return total += curr.amount}, 0);

    if (balance < amount) throw {type: "insufficient funds", message: "Card has insufficient funds"};

    await insert({cardId: dbCard.id, businessId, amount});

    return balance - amount;
}