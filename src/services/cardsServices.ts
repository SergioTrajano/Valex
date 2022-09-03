import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { compareSync, hashSync } from "bcrypt";
import Cryptr from "cryptr";
import dotenv from "dotenv";

import { findById as findEmployeeById } from "../repositories/employeeRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { findByTypeAndEmployeeId, insert, findById as findCardById, update, find } from "../repositories/cardRepository";
import { findByCardId as findTransactionsByCardId } from "../repositories/paymentRepository";
import { findByCardId as findRechargesByCardId } from "../repositories/rechargeRepository";
import { anauthorizedCompanyError, creationNotAllowedError, notFoundError, expirateCardError, invalidCVC, badPasswordError, ActivatedCardError } from "../utils/errorGenerators";

dotenv.config();

type TransactionTypes =
  | "groceries"
  | "restaurant"
  | "transport"
  | "education"
  | "health";

function generateCardNumber() {
    return faker.finance.creditCardNumber();
}

function formatCardHolderName(fullName: string) {
    let formatName: string = "";

    fullName.split(" ").forEach((name: string, i) => {
        if (i === 0 || i === fullName.split(" ").length - 1) formatName += `${name[0].toUpperCase()}${name.slice(1).toLowerCase()} `;
        else if (name.length > 2) formatName += `${name[0].toUpperCase()} `
    });

    return formatName.trim();
}

function generateExpirationDate() {
    return dayjs().add(5, "year").format("MM/DD/YY");
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

function rgxPassword(password: string) {
    const passwordRGX = /^[0-9]{4,6}$/;

    return passwordRGX.test(password);
}

function hashPassword(password: string) {
    const SALT: number = Number(process.env.BCRYPT_SALT);

    return hashSync(password, SALT);
}

function comparePasswords(dbPassword: string , password: string) {
    return compareSync(password, dbPassword);
}

export async function createCardname(APIKey: any ,employeeId: number, cardType: TransactionTypes) {
    const dbCompany = await findByApiKey(APIKey);
    if (!dbCompany) throw anauthorizedCompanyError();

    const employeedData = await findEmployeeById(employeeId);
    if (!employeedData) throw notFoundError("employee");

    const dbCard = await findByTypeAndEmployeeId(cardType, employeeId);
    if (dbCard !== undefined) throw creationNotAllowedError();

    const allDbCards = await find();

    let cardNumber = generateCardNumber();
    while (allDbCards.some(card => card.number === cardNumber)) cardNumber = generateCardNumber();

    const cardData = {
        employeeId,
        number: cardNumber,
        cardholderName: formatCardHolderName(employeedData.fullName),
        securityCode: encryptedSecurityCode(encrypter()),
        expirationDate: generateExpirationDate(),
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
    if (dayjs(dbCard.expirationDate).diff(dayjs()) < 0) throw expirateCardError();
    if (dbCard.password) throw ActivatedCardError();
    if (decryptedSecurityCode( encrypter(), dbCard.securityCode) !== securityCode) throw invalidCVC();
    if (!rgxPassword(password)) throw badPasswordError();

    const bcryptedPassword = hashPassword(password);
    const cardData = {
        password: bcryptedPassword,
    }

    await update(id, cardData);
}

export async function getCardStatement(cardId: number) {
    const dbCard = await findCardById(cardId);
    if (!dbCard) throw notFoundError("card");

    const cardTransactions = await findTransactionsByCardId(cardId);
    const cardRecharges = await findRechargesByCardId(cardId);

    const cardStatement = {
        balance: cardRecharges.reduce((total, curr) => {return total += curr.amount}, 0) - cardTransactions.reduce((total, curr) => { return total += curr.amount}, 0),
        transactions: cardTransactions,
        recharges: cardRecharges,
    };

    return cardStatement;
}

export async function blockCardService(cardId: number, password: string, block: boolean) {
    const dbCard = await findCardById(cardId);
    if (!dbCard) throw notFoundError("card");
    if (dayjs(dbCard.expirationDate).diff(dayjs()) < 0) throw expirateCardError();
    if (dbCard.isBlocked === block) throw { type: "invalid_card_property", message: "Card is already blocked!"};
    if (!comparePasswords(dbCard.password || "", password)) throw { type: "invalid_password", message: "Invalid credentials!"};

    await update(cardId, { isBlocked: block });
}