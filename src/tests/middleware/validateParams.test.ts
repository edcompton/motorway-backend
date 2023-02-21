import { HttpError } from '../../middleware/exceptions';
import { Request, Response } from 'express';
import { validateParams } from '../../middleware/validateParams';

describe('validateParams', () => {
  const req: Request = {
    params: {},
    query: {},
  } as Request;

  const res: Response = {} as Response;
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call next when parameters are valid', () => {
    req.params.id = '123';
    req.query.timestamp = '2022-01-01 12:00:00 +0000';
    validateParams(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should throw a 400 error when ID parameter is missing', () => {
    delete req.params.id;
    req.query.timestamp = '2022-01-01 12:00:00 +0000';
    expect(() => validateParams(req, res, next)).toThrowError(new HttpError(400, 'ID parameter is required.'));
    expect(next).not.toHaveBeenCalled();
  });

  it('should throw a 400 error when ID parameter is not a positive number', () => {
    req.params.id = '-123';
    req.query.timestamp = '2022-01-01 12:00:00 +0000';
    expect(() => validateParams(req, res, next)).toThrowError(new HttpError(400, 'ID parameter must be a positive number.'));
    expect(next).not.toHaveBeenCalled();
  });

  it('should throw a 400 error when timestamp parameter is missing', () => {
    req.params.id = '123';
    req.query.timestamp = undefined;
    expect(() => validateParams(req, res, next)).toThrowError(new HttpError(400, 'Timestamp parameter is required.'));
    expect(next).not.toHaveBeenCalled();
  });

  it('should throw a 400 error when timestamp parameter has an invalid format', () => {
    req.params.id = '123';
    req.query.timestamp = 'invalid';
    expect(() => validateParams(req, res, next)).toThrowError(new HttpError(400, 'Invalid timestamp format.'));
    expect(next).not.toHaveBeenCalled();
  });
});
