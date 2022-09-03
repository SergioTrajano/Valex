import { Router } from "express";

import { schemaValidateBodyMiddleware } from "../middlewares/validateSchemaMiddleware";
import { addPurchaseSchema } from "../schemas/purchasesSchemas";
import { addPurchase } from "../controllers/purchasesControllers";

const router = Router();

router.post("/purchases", schemaValidateBodyMiddleware(addPurchaseSchema), addPurchase);

export default router;