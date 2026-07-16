import type { ErrorRequestHandler } from 'express';
import createHttpError from 'http-errors';
import { ZodError } from 'zod';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const isDev = process.env.NODE_ENV === 'development';

  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Validation failed',
      errors: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  const status = createHttpError.isHttpError(err) ? err.status : 500;
  const message = err instanceof Error ? err.message : 'Internal server error';

  res.status(status).json({
    message,
    ...(isDev && err instanceof Error && { stack: err.stack }),
  });
};

export default errorHandler;
