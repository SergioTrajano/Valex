import { Request, Response } from "express";

import { createCardname, activateCard, getCardStatement, blockCardService } from "../services/cardsServices"

export async function createCard(req: Request, res: Response) {
    const { employeeId, cardType } = req.body;
    const apiKey = req.headers['x-api-key'];

    const newCard: Object = await createCardname(apiKey, employeeId, cardType);

    res.status(201).send(newCard);
}

export async function unlockyCard(req: Request, res: Response) {
    const { id, securityCode, password } = req.body;

    await activateCard(id, password, securityCode);

    res.status(200).send("Activated!");
}

export async function cardStatement(req: Request, res: Response) {
    const id: number = Number(req.params.cardId);
    const cardStatement: Object = await getCardStatement(id);

    res.status(200).send(cardStatement);
}

export function blockCard(block: boolean) {
    return async (req: Request, res: Response) => {
    const { id, password } = req.body;

    await blockCardService(id, password, block);

    res.sendStatus(200);
    }
}