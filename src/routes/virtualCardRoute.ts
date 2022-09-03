import { Router } from "express";

import { schemaValidateBodyMiddleware } from "../middlewares/validateSchemaMiddleware";
import { createVirtualCardSchema } from "../schemas/virtualCardSchemas";
import { createVirtualCard, deleteVirtualCard } from "../controllers/virtualCardsControllers";

const router = Router();

router.post("/virtualCards",schemaValidateBodyMiddleware(createVirtualCardSchema), createVirtualCard);
router.delete("/virtualCards", schemaValidateBodyMiddleware(createVirtualCardSchema), deleteVirtualCard);

export default router;