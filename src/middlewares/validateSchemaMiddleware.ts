import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

export function  schemaValidateHeadersMiddleware(schema: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => { 
      const { error } = schema.validate(req.headers, {abortEarly: false});

      if (error) {
        throw {type: "invalid_Header", message: (error.details.map(detail => detail.message))};
      }
  
      next();
    }
}

export function  schemaValidateBodyMiddleware(schema: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => { 
      const { error } = schema.validate(req.body, {abortEarly: false});

      if (error) {
        throw {type: "invalid_Body", message: (error.details.map(detail => detail.message))};
      }
  
      next();
    }
}
