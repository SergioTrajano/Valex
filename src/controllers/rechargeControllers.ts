import { Request, Response } from "express";

import { addRechargeService} from "../services/rechargesServices";

export async function addRecharge(req: Request, res: Response) {
    const { id, amount } = req.body;
    const apikey: any = req.headers["x-api-key"];
    
    const newBalance: Object = {
        balance: await addRechargeService(id, amount, apikey),
    };

    res.status(200).send(newBalance);
}