import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import updateLocale from 'dayjs/plugin/updateLocale';
var localeData = require('dayjs/plugin/localeData')
require('dayjs/locale/de')
dayjs.extend(localeData)

dayjs.extend(utc);
dayjs.extend(updateLocale);

import { decryptSecurityCode, encryptSecurityCode } from "../utils/securityCodeEncrypter";
import { hashPassword, comparePasswords } from "../utils/passwordENcrypter";
import * as generateCardData from "../utils/generateCardData";
import { findById as findEmployeeById } from "../repositories/employeeRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { findByTypeAndEmployeeId, insert, findById as findCardById, update, find } from "../repositories/cardRepository";
import { findByCardId as findTransactionsByCardId } from "../repositories/paymentRepository";
import { findByCardId as findRechargesByCardId } from "../repositories/rechargeRepository";
import { anauthorizedCompanyError, creationNotAllowedError, notFoundError, expirateCardError, invalidCVC, badPasswordError, ActivatedCardError } from "../utils/errorGenerators";

type TransactionTypes =
  | "groceries"
  | "restaurant"
  | "transport"
  | "education"
  | "health";

function rgxPassword(password: string) {
    const passwordRGX = /^[0-9]{4,6}$/;

    return passwordRGX.test(password);
}

export async function createCardname(APIKey: any ,employeeId: number, cardType: TransactionTypes) {
    const dbCompany = await findByApiKey(APIKey);
    if (!dbCompany) throw anauthorizedCompanyError();

    const employeedData = await findEmployeeById(employeeId);
    if (!employeedData) throw notFoundError("employee");

    const dbCard = await findByTypeAndEmployeeId(cardType, employeeId);
    if (dbCard !== undefined) throw creationNotAllowedError();

    const allDbCards = await find();

    let cardNumber = generateCardData.generateCardNumber();
    while (allDbCards.some(card => card.number === cardNumber)) cardNumber = generateCardData.generateCardNumber();
    
    const cardData = {
        employeeId,
        number: cardNumber,
        cardholderName: generateCardData.formatCardHolderName(employeedData.fullName),
        securityCode: encryptSecurityCode(generateCardData.generateSecurityCode()),
        expirationDate: generateCardData.generateExpirationDate(),
        password: undefined,
        isVirtual: false,
        originalCardId: undefined,
        isBlocked: false,
        type: cardType,
    }
    
    await insert(cardData);

    return cardData;
}

export async function activateCard(id: number, password: string, securityCode: string) {
    const dbCard = await findCardById(id);

    if (!dbCard) throw notFoundError("card");
    if (dbCard.isVirtual) throw { type: "anathorized", message: "VirtualCards can not be activated"};
    if (dayjs(dbCard.expirationDate.split("/")[0]+"/01/"+dbCard.expirationDate.split("/")[1]).diff(dayjs(), "month") < 0) throw expirateCardError();
    if (dbCard.password) throw ActivatedCardError();
    if (decryptSecurityCode(dbCard.securityCode) !== securityCode) throw invalidCVC();
    if (!rgxPassword(password)) throw badPasswordError();

    const cardData = {
        password: hashPassword(password),
    }

    await update(id, cardData);
}

export async function getCardStatement(cardId: number) {
    const dbCard = await findCardById(cardId);

    if (!dbCard) throw notFoundError("card");

    const cardTransactions = await findTransactionsByCardId(cardId);
    const cardRecharges = await findRechargesByCardId(cardId);

    const cardStatement = {
        balance: generateCardData.generateBalance(cardRecharges, cardTransactions),
        transactions: cardTransactions,
        recharges: cardRecharges,
    };

    return cardStatement;
}

export async function blockCardService(cardId: number, password: string, block: boolean) {
    const dbCard = await findCardById(cardId);

    if (!dbCard) throw notFoundError("card");
    if (dayjs(dbCard.expirationDate.split("/")[0]+"/01/"+dbCard.expirationDate.split("/")[1]).diff(dayjs(), "month") < 0) throw expirateCardError();
    if (dbCard.isBlocked === block) throw { type: "invalid_card_property", message: "Card is already blocked!"};
    if (!comparePasswords(dbCard.password || "", password)) throw { type: "invalid_password", message: "Invalid credentials!"};

    await update(cardId, { isBlocked: block });
}