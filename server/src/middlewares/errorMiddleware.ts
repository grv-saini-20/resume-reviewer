import { Request, Response, NextFunction } from 'express';

const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

interface ErrorResponse {
  message: string;
  stack?: string;
}

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  console.error(`[Error ${statusCode}] ${err.message}`);

  const response: ErrorResponse = {
    message: err.message,
    // only expose the stack trace in development — never in production
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  };

  res.status(statusCode).json(response);
};

export {notFound, errorHandler};
