import { Request, Response } from "express";

import { createVirtualCardService } from "../services/virtualCardsServices";

export async function createVirtualCard(req: Request, res: Response) {
    const { id, password } = req.body;
    
    const newVirtualCard: Object = await createVirtualCardService(id, password);

    res.status(201).send(newVirtualCard);
}