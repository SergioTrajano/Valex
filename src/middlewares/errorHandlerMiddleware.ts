import { Request, Response, NextFunction } from "express";

export default async function errorMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
    if (error.type === "invalid_APIKey") {
        res.status(401).send(error.message);
        return;
    }
    if (error.type === "invalid_employee") {
        res.status(404).send(error.message);
        return;
    }
    if (error.type === "card_already_exists") {
        res.status(405).send(error.message);
        return;
    }
    if (error.type === "invalid_Header" || error.type === "invalid_Body") {
        res.status(422).send(error.message);
        return;
    }

    res.sendStatus(500);
    return;
}