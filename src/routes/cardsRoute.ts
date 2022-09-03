import { Router } from "express";

import { schemaValidateHeadersMiddleware, schemaValidateBodyMiddleware } from "../middlewares/validateSchemaMiddleware";
import { createCard, unlockyCard, cardStatement } from "../controllers/cardsControllers";
import { validateCompanyAPIInHeader } from "../schemas/headerSchemas";
import { createCardSchema, activateCardSchema } from "../schemas/cardsBodySchema";

const router = Router();

router.post("/cards", schemaValidateHeadersMiddleware(validateCompanyAPIInHeader), schemaValidateBodyMiddleware(createCardSchema), createCard);
router.put("/cards/activation", schemaValidateBodyMiddleware(activateCardSchema), unlockyCard);
router.get("/cards/:cardId", cardStatement);

export default router;