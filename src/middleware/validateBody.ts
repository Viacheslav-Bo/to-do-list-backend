import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import createHttpError from 'http-errors';

export const validateBody = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(createHttpError(400, error as Error));
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      next(createHttpError(400, error as Error));
    }
  };
};
