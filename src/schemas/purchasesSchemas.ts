import joi, { ObjectSchema } from "joi";

export const addPurchaseSchema: ObjectSchema = joi.object({
    cardId: joi.number().integer().required(),
    password: joi.string().required(),
    businessId: joi.number().integer().required(),
    amount: joi.number().greater(0).required(),
});