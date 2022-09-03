import { Request, Response } from "express";

import { createCardname, activateCard, getCardStatement } from "../services/cardsServices"

export async function createCard(req: Request, res: Response) {
    const { employeeId, cardType } = req.body;
    const apiKey = req.headers['x-api-key'];

    await createCardname(apiKey, employeeId, cardType);

    res.sendStatus(201);
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