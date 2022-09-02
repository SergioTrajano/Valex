import joi, { ObjectSchema } from "joi";

export const createCardSchema: ObjectSchema = joi.object({
    employeeId: joi.number().integer().required(),
    cardType: joi.string().valid("education", "groceries", "restaurant", "transport", "health").required(),
});