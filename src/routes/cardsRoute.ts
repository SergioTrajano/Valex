import { Router } from "express";

import { schemaValidateHeadersMiddleware, schemaValidateBodyMiddleware } from "../middlewares/validateSchemaMiddleware";
import { createCard } from "../controllers/cardsControllers";
import { validateCompanyAPIInHeader } from "../schemas/headerSchemas";
import { createCardSchema } from "../schemas/cardsBodySchema";

const router = Router();

router.post("/cards", schemaValidateHeadersMiddleware(validateCompanyAPIInHeader), schemaValidateBodyMiddleware(createCardSchema), createCard);

export default router;