import joi, { ObjectSchema } from "joi";

export const addPurchaseSchema: ObjectSchema = joi.object({
    cardId: joi.number().integer().required(),
    password: joi.string().trim().required(),
    businessId: joi.number().integer().required(),
    amount: joi.number().greater(0).required(),
});

export const addOnlinePurchaseSchema: ObjectSchema = joi.object({
    number: joi.string().trim().required(),
    name: joi.string().trim().required(),
    expirationDate: joi.string().pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/),
    securityCode: joi.string().trim().required(),
    businessId: joi.number().integer().required(),
    amount: joi.number().greater(0).required(),
});