import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";
import dotenv from "dotenv";

import { findById } from "../repositories/employeeRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { findByTypeAndEmployeeId, insert } from "../repositories/cardRepository";
import { anauthorizedCompanyError, creationNotAllowedError, notFoundEmployeeError } from "../utils/errorGenerators";

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
    return dayjs().add(5, "year").format("MM/YY");
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

export async function createCardname(APIKey: any ,employeeId: number, cardType: TransactionTypes) {
    const dbCompany = await findByApiKey(APIKey);
    if (!dbCompany) throw anauthorizedCompanyError();

    const employeedData = await findById(employeeId);
    if (!employeedData) throw notFoundEmployeeError();

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