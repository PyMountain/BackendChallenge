import { Request, Response, NextFunction } from 'express';
import { AppError } from '../error/AppError';

export function handleException(err: Error, req: Request, res: Response, next: NextFunction) {
  if(err instanceof AppError) {
    return res.status(err.code).json({
      message: err.message
    });
  }

  return res.status(500).json({
    message: err.message || "Internal server Error"
  });
}