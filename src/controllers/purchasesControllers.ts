import { Request, Response } from "express";
import { addPurchaseService, addOnlinePurchaseService } from "../services/purchasesServices";

export async function addPurchase(req: Request, res: Response) {
    const { cardId, password, businessId, amount } = req.body;

    const newBalance: Object = {
        balance: await addPurchaseService(cardId, password, businessId, amount),
    }

    res.status(200).send(newBalance);
}

export async function addOnlinePurchase(req: Request, res: Response) {
    const { number, name, expirationDate, securityCode, businessId, amount } = req.body;

    const newBalance: Object = {
        balance: await addOnlinePurchaseService(number, name, expirationDate, securityCode, businessId, amount),
    }

    res.status(200).send(newBalance);
}