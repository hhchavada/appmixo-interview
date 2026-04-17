import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { sendValidationError } from '../utils/response';

export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      
      sendValidationError(res, 'Validation failed', errorMessage);
      return;
    }

    next();
  };
};
