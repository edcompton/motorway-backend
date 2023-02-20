import { HttpError } from '../../middleware/exceptions';
import errorHandler from '../../middleware/error';
import { Request, Response } from 'express';

describe('error middleware', () => {
  const mockRequest = {} as Request;
  const mockNext = jest.fn();
  let mockResponse: Response;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      headersSent: false,
    } as unknown as Response;
  });

  it('should send a 500 response with default message for unknown error', () => {
    const mockError = new HttpError(500, 'Internal Server Error');

    errorHandler(mockError, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith({
      error: 'Internal Server Error',
    });
  });

  it('should send a response with status and message from error object', () => {
    const mockError = new HttpError(400, 'Bad Request');

    errorHandler(mockError, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({
      error: 'Bad Request',
    });
  });

  it('should call next middleware when headers have been sent', () => {
    const mockError = new HttpError(500, '');
    mockResponse.headersSent = true;

    errorHandler(mockError, mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.send).not.toHaveBeenCalled();
  });

  it('should set default message to "Internal Server Error" when error has no message', () => {
    const mockError = new HttpError(404);

    errorHandler(mockError, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledWith({
      error: 'Internal Server Error',
    });
  });
});
