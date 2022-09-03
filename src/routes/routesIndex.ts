import { Router } from "express";

import cardRouter from "./cardsRoute";
import rechargeRouter from "./recharsesRoute";
import purchasesRouter from "./purchasesRoute";

const routes = Router();

routes.use(cardRouter);
routes.use(rechargeRouter);
routes.use(purchasesRouter);

export default routes;