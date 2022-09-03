import joi, { ObjectSchema } from "joi";

export const createCardSchema: ObjectSchema = joi.object({
    employeeId: joi.number().integer().required(),
    cardType: joi.string().trim().valid("education", "groceries", "restaurant", "transport", "health").required(),
});

export const activateCardSchema: ObjectSchema = joi.object({
    id: joi.number().integer().required(),
    securityCode: joi.string().trim().required().pattern(/^[0-9]{3}$/),
    password: joi.string().trim().required(),
});

export const blockCardSchema = joi.object({
    id: joi.number().integer().required(),
    password: joi.string().trim().required(),
});