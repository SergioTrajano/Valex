import joi, { ObjectSchema } from "joi";

export const addRechargeSchema: ObjectSchema = joi.object({
    id: joi.number().integer().required(),
    amount: joi.number().greater(0).required(),
});