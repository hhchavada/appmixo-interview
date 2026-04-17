import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const httpLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const responseTimeMs = Number(end - start) / 1_000_000;

    logger.info(`${req.method} ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTimeMs: Math.round(responseTimeMs * 100) / 100,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
  });

  next();
};

