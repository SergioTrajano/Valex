import dayjs from "dayjs";

import { notFoundError, ActivatedCardError, expirateCardError, anauthorizedCompanyError } from "../utils/errorGenerators";
import { findById as findCardById } from "../repositories/cardRepository";
import { findByCardId as findRechargesByCardId ,insert } from "../repositories/rechargeRepository";
import { findByCardId as findTransactionsByCardId } from "../repositories/paymentRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { generateBalance } from "../utils/generateCardData";

export async function addRechargeService(cardId: number, amount: number, APIKey: string) {
    const dbCard = await findCardById(cardId);
    const dbCompany = await findByApiKey(APIKey);

    if (!dbCompany) throw anauthorizedCompanyError();
    if (!dbCard) throw notFoundError("card");
    if (!dbCard.password) throw ActivatedCardError();
    if (dbCard.isVirtual) throw { type: "anathorized", message: "VirtualCards can not be recharged"};
    if (dayjs(dbCard.expirationDate.split("/")[0]+"/01/"+dbCard.expirationDate.split("/")[1]).diff(dayjs(), "month") < 0) throw expirateCardError();

    await insert({
        cardId,
        amount
    });

    const cardTransactions = await findTransactionsByCardId(cardId);
    const cardRecharges = await findRechargesByCardId(cardId);

    return generateBalance(cardRecharges, cardTransactions);
}