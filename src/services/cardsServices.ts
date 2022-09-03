import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { hashSync } from "bcrypt";
import Cryptr from "cryptr";
import dotenv from "dotenv";

import { findById as findEmployeeById } from "../repositories/employeeRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { findByTypeAndEmployeeId, insert, findById as findCardById, update } from "../repositories/cardRepository";
import { anauthorizedCompanyError, creationNotAllowedError, notFoundError, expirateCardError, notBlockedError, invalidCVC, badPasswordError } from "../utils/errorGenerators";

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

    return formatName;
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

export async function createCardname(APIKey: any ,employeeId: number, cardType: TransactionTypes) {
    const dbCompany = await findByApiKey(APIKey);
    if (!dbCompany) throw anauthorizedCompanyError();

    const employeedData = await findEmployeeById(employeeId);
    if (!employeedData) throw notFoundError("employee");

    const dbCard = await findByTypeAndEmployeeId(cardType, employeeId);
    if (dbCard !== undefined) throw creationNotAllowedError();

    const cardData = {
        employeeId,
        number: generateCardNumber(),
        cardholderName: formatCardHolderName(employeedData.fullName),
        securityCode: encryptedSecurityCode(encrypter()),
        expirationDate: generateExpirationDate(),
        password: undefined,
        isVirtual: false,
        originalCardId: undefined,
        isBlocked: true,
        type: cardType,
    }
    
    await insert(cardData);
}

export async function activateCard(id: number, password: string, securityCode: string) {
    const dbCard = await findCardById(id);
    if (!dbCard) throw notFoundError("card");
    if (dayjs(dbCard.expirationDate).diff(dayjs()) < 0) throw expirateCardError();
    if (dbCard.password) throw notBlockedError();
    if (decryptedSecurityCode( encrypter(), dbCard.securityCode) !== securityCode) throw invalidCVC();
    if (!rgxPassword(password)) throw badPasswordError();

    const SALT: number = Number(process.env.BCRYPT_SALT);

    const bcryptedPassword = hashSync(password, SALT);
    const cardData = {
        password: bcryptedPassword,
        isBlocked: false,
    }

    await update(id, cardData);
}