import joi, { ObjectSchema } from "joi";

export const createVirtualCardSchema: ObjectSchema = joi.object({
    id: joi.number().integer().required(),
    password: joi.string().trim().required(),
});