import { Router } from "express";

import { schemaValidateBodyMiddleware } from "../middlewares/validateSchemaMiddleware";
import { createVirtualCardSchema } from "../schemas/virtualCardSchemas";
import { createVirtualCard } from "../controllers/virtualCardsControllers";

const router = Router();

router.post("/virtualCards",schemaValidateBodyMiddleware(createVirtualCardSchema), createVirtualCard);

export default router;