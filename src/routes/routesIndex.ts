import { Router } from "express";

import cardRouter from "./cardsRoute";
import rechargeRouter from "./recharsesRoute";
import purchasesRouter from "./purchasesRoute";
import virtualCardRouter from "./virtualCardRoute";

const routes = Router();

routes.use(cardRouter);
routes.use(rechargeRouter);
routes.use(purchasesRouter);
routes.use(virtualCardRouter);

export default routes;