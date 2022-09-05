import dayjs from "dayjs";

import { comparePasswords } from "../utils/passwordENcrypter";
import * as generateCardData from "../utils/generateCardData";
import { encryptSecurityCode } from "../utils/securityCodeEncrypter";
import { findById as findByCardId, find, insert, remove } from "../repositories/cardRepository";
import { notFoundError, expirateCardError } from "../utils/errorGenerators";

export async function createVirtualCardService(id: number, password: string) {
    const dbCard = await findByCardId(id);
    const allDbCards = await find();

    if (!dbCard) throw notFoundError("card");
    if(!comparePasswords(dbCard.password || "", password)) throw { type: "invalid_password", message: "Invalid credentials!"};
    if (dayjs(dbCard.expirationDate.split("/")[0]+"/01/"+dbCard.expirationDate.split("/")[1]).diff(dayjs(), "month") < 0) throw expirateCardError();

    let cardNumber = generateCardData.generateCardNumber();
    while (allDbCards.some(card => card.number === cardNumber)) cardNumber = generateCardData.generateCardNumber();

    const securityCode: string = generateCardData.generateSecurityCode();
    const cardData = {
        employeeId: dbCard.employeeId,
        number: cardNumber,
        cardholderName: dbCard.cardholderName,
        securityCode: encryptSecurityCode(securityCode),
        expirationDate: generateCardData.generateExpirationDate(),
        password: dbCard.password,
        isVirtual: true,
        originalCardId: dbCard.id,
        isBlocked: false,
        type: dbCard.type,
    }
    
    await insert(cardData);

    return {...cardData, securityCode: securityCode};
}

export async function deleteVirtualCardService(id: number, password: string) {
    const dbCard = await findByCardId(id);

    if (!dbCard) throw notFoundError("card");
    if (!dbCard.isVirtual) throw { type: "invalid_card_property", message: "Card is not virtual!"};
    if(!comparePasswords(dbCard.password || "", password)) throw { type: "invalid_password", message: "Invalid credentials!"};

    await remove(id);
}