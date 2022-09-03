import { compareSync } from "bcrypt";
import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import dayjs from "dayjs";

import { findById as findByCardId, find, insert } from "../repositories/cardRepository";
import { notFoundError,  } from "../utils/errorGenerators";

//refatorar
function comparePasswords(dbPassword: string , password: string) {
    return compareSync(password, dbPassword);
}

function generateCardNumber() {
    return faker.finance.creditCardNumber();
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

function generateExpirationDate() {
    return dayjs().add(5, "year").format("MM/DD/YY");
}

export async function createVirtualCardService(id: number, password: string) {
    const dbCard = await findByCardId(id);
    const allDbCards = await find();

    if (!dbCard) throw notFoundError("card");
    if(!comparePasswords(dbCard.password || "", password)) throw { type: "invalid_password", message: "Invalid credentials!"};

    let cardNumber = generateCardNumber();
    while (allDbCards.some(card => card.number === cardNumber)) cardNumber = generateCardNumber();

    const cardData = {
        employeeId: dbCard.employeeId,
        number: cardNumber,
        cardholderName: dbCard.cardholderName,
        securityCode: encryptedSecurityCode(encrypter()),
        expirationDate: generateExpirationDate(),
        password: dbCard.password,
        isVirtual: true,
        originalCardId: dbCard.id,
        isBlocked: false,
        type: dbCard.type,
    }
    
    await insert(cardData);

    return cardData;
}