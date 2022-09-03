import { Request, Response } from "express";

import { createVirtualCardService, deleteVirtualCardService } from "../services/virtualCardsServices";

export async function createVirtualCard(req: Request, res: Response) {
    const { id, password } = req.body;
    
    const newVirtualCard: Object = await createVirtualCardService(id, password);

    res.status(201).send(newVirtualCard);
}

export async function deleteVirtualCard(req: Request, res: Response) {
    const { id, password } = req.body;

    await deleteVirtualCardService(id, password);

    res.sendStatus(200);
}