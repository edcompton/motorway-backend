import { NextFunction, Request, Response } from 'express';
import { HttpError } from './exceptions';

function errorHandler(err: HttpError, _: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).send({
    error: message,
  });
}

export default errorHandler;
