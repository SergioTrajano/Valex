import dayjs from "dayjs";

import { notFoundError, ActivatedCardError, expirateCardError, anauthorizedCompanyError } from "../utils/errorGenerators";
import { findById as findCardById } from "../repositories/cardRepository";
import { findByCardId as findRechargesByCardId ,insert } from "../repositories/rechargeRepository";
import { findByCardId as findTransactionsByCardId } from "../repositories/paymentRepository";
import { findByApiKey } from "../repositories/companyRepository";

export async function addRechargeService(cardId: number, amount: number, APIKey: string) {
    const dbCard = await findCardById(cardId);
    const dbCompany = await findByApiKey(APIKey);

    if (!dbCompany) throw anauthorizedCompanyError();
    if (!dbCard) throw notFoundError("card");
    if (!dbCard.password) throw ActivatedCardError();
    if (dayjs(dbCard.expirationDate).diff(dayjs()) < 0) throw expirateCardError();

    await insert({cardId, amount});

    //refatorar com a função em cardServices
    const cardTransactions = await findTransactionsByCardId(cardId);
    const cardRecharges = await findRechargesByCardId(cardId);

    return cardRecharges.reduce((total, curr) => {return total += curr.amount}, 0) - cardTransactions.reduce((total, curr) => { return total += curr.amount}, 0);
}