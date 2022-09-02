import { Request, Response } from "express";

import {createCardname} from "../services/cardsServices"

export async function createCard(req: Request, res: Response) {
    const { employeeId, cardType } = req.body;
    const apiKey = req.headers['x-api-key'];

    await createCardname(apiKey, employeeId, cardType);

    res.sendStatus(201);
}