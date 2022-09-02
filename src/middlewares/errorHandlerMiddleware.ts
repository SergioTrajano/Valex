import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

export default async function errorHandler(error: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) {

    console.log(error);
    return res.sendStatus(500);
}