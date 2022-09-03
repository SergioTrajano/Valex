import { Router } from "express";

import { schemaValidateBodyMiddleware } from "../middlewares/validateSchemaMiddleware";
import { addPurchaseSchema, addOnlinePurchaseSchema } from "../schemas/purchasesSchemas";
import { addPurchase, addOnlinePurchase } from "../controllers/purchasesControllers";

const router = Router();

router.post("/purchases", schemaValidateBodyMiddleware(addPurchaseSchema), addPurchase);
router.post("/purchases/online", schemaValidateBodyMiddleware(addOnlinePurchaseSchema), addOnlinePurchase);

export default router;