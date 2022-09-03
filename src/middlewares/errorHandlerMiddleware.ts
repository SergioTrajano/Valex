import { Request, Response, NextFunction } from "express";

export default async function errorMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
    if (error.type === "invalid_APIKey" || error.type === "invalid_CVC") {
        res.status(401).send(error.message);
        return;
    }
    if (error.type === "invalid_employee") {
        res.status(404).send(error.message);
        return;
    }
    if (error.type === "card_already_exists" || error.type === "invalid_password") {
        res.status(405).send(error.message);
        return;
    }
    if (error.type === "invalid_Header" || error.type === "invalid_Body") {
        res.status(422).send(error.message);
        return;
    }
    if (error.type === "card_expired" || error.type === "card_is_not_blocked") {
        res.status(403).send(error.message);
        return;
    }

    console.log(error);
    res.sendStatus(500);
    return;
}