import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/response';
import { MESSAGES, HTTP_STATUS, ROLES } from '../constants/constants';
import { AuthenticatedRequest } from '../interfaces/common.interface';

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(
        res,
        MESSAGES.AUTH.TOKEN_REQUIRED,
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      sendError(
        res,
        MESSAGES.AUTH.TOKEN_INVALID,
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }
  } catch (error) {
    sendError(
      res,
      MESSAGES.AUTH.TOKEN_INVALID,
      HTTP_STATUS.UNAUTHORIZED
    );
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(
        res,
        MESSAGES.AUTH.TOKEN_REQUIRED,
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(
        res,
        MESSAGES.AUTH.ACCESS_DENIED,
        HTTP_STATUS.FORBIDDEN
      );
      return;
    }

    next();
  };
};

export const requireAdmin = authorize(ROLES.ADMIN);
export const requireUser = authorize(ROLES.USER, ROLES.ADMIN);
