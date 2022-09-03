import { Router } from "express";

import { schemaValidateHeadersMiddleware, schemaValidateBodyMiddleware } from "../middlewares/validateSchemaMiddleware";
import { validateCompanyAPIInHeader } from "../schemas/headerSchemas";
import { addRechargeSchema } from "../schemas/rechargeSchemas";
import { addRecharge } from "../controllers/rechargeControllers";

const router = Router();

router.post("/recharges", schemaValidateHeadersMiddleware(validateCompanyAPIInHeader), schemaValidateBodyMiddleware(addRechargeSchema), addRecharge);

export default router;