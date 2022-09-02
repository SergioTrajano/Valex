import joi, { ObjectSchema } from "joi";

export const validateCompanyAPIInHeader: ObjectSchema = joi.object({
    'x-api-key': joi.string().required()
}).options({ allowUnknown: true });