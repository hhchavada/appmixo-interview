import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodTypeAny } from 'zod';
import { sendValidationError } from '../utils/response';

type ZodSchemas = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

export const validateRequest = (schemas: ZodSchemas) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schemas.params) {
        const parsed = schemas.params.parse(req.params);
        (req as any).params = parsed;
      }

      if (schemas.query) {
        const parsed = schemas.query.parse(req.query);
        (req as any).query = parsed;
      }

      if (schemas.body) {
        const parsed = schemas.body.parse(req.body);
        (req as any).body = parsed;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues
          .map((i) => `${i.path.join('.') || 'request'}: ${i.message}`)
          .join(', ');

        sendValidationError(res, 'Validation failed', details);
        return;
      }

      next(error);
    }
  };
};

