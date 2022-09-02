import { Router } from "express";

import cardRouter from "./cardsRoute"

const routes = Router();

routes.use(cardRouter);

export default routes;