import { Request, Response } from "express";

import { createCardname, activateCard} from "../services/cardsServices"

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