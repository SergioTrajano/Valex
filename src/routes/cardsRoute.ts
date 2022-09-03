import { Router } from "express";

import { schemaValidateHeadersMiddleware, schemaValidateBodyMiddleware } from "../middlewares/validateSchemaMiddleware";
import { createCard, unlockyCard, cardStatement, blockCard } from "../controllers/cardsControllers";
import { validateCompanyAPIInHeader } from "../schemas/headerSchemas";
import { createCardSchema, activateCardSchema, blockCardSchema } from "../schemas/cardsBodySchema";

const router = Router();

router.post("/cards", schemaValidateHeadersMiddleware(validateCompanyAPIInHeader), schemaValidateBodyMiddleware(createCardSchema), createCard);

router.patch("/cards/activation", schemaValidateBodyMiddleware(activateCardSchema), unlockyCard);
router.patch("/cards/block", schemaValidateBodyMiddleware(blockCardSchema), blockCard(true));
router.patch("/cards/unblock", schemaValidateBodyMiddleware(blockCardSchema), blockCard(false));

router.get("/cards/:cardId", cardStatement);

export default router;