import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
import { HttpError } from './exceptions';

export function validateParams(req: Request, _: Response, next: NextFunction) {
  const id = req.params.id;
  const timestamp = req.query.timestamp as string;

  if (!id) {
    throw new HttpError(400, 'ID parameter is required.');
  }

  const idNumber = Number(id);
  if (isNaN(idNumber) || idNumber < 0) {
    throw new HttpError(400, 'ID parameter must be a positive number.');
  }

  if (!timestamp) {
    throw new HttpError(400, 'Timestamp parameter is required.');
  }

  const timestampMoment = moment(timestamp, 'YYYY-MM-DD HH:mm:ss Z');
  if (!timestampMoment.isValid()) {
    throw new HttpError(400, 'Invalid timestamp format.');
  }

  next();
}
