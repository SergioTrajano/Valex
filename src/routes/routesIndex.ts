import { Router } from "express";

import cardRouter from "./cardsRoute";
import rechargeRouter from "./recharsesRoute";

const routes = Router();

routes.use(cardRouter);
routes.use(rechargeRouter);

export default routes;