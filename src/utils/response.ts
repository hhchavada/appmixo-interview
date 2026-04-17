import { Response } from 'express';
import { ApiResponse } from '../interfaces/common.interface';
import { HTTP_STATUS } from '../constants/constants';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Operation successful',
  statusCode: number = HTTP_STATUS.OK
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    statusCode,
  };
  
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string = 'Internal server error',
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  error?: string
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(error && { error }),
    statusCode,
  };
  
  return res.status(statusCode).json(response);
};

export const sendValidationError = (
  res: Response,
  message: string = 'Validation failed',
  error: string
): Response => {
  return sendError(res, message, HTTP_STATUS.BAD_REQUEST, error);
};
