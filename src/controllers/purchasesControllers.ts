import { Request, Response } from "express";
import { addPurchaseService } from "../services/purchasesServices";

export async function addPurchase(req: Request, res: Response) {
    const { cardId, password, businessId, amount } = req.body;

    const newBalance: Object = {
        balance: await addPurchaseService(cardId, password, businessId, amount),
    }

    res.status(200).send(newBalance);
}