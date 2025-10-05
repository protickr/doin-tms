import Ajv, { ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import { Request, Response, NextFunction } from "express";

const ajv = new Ajv();
addFormats(ajv);

// request body validation middleware
export const validateBody =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const validate = ajv.compile(schema);
    if (!validate(req.body)) {
      return res.status(400).json({ errors: validate.errors });
    }
    next();
  };

// global error handling middleware
export const globalErrorHandler = (
  err: Error & { statusCode?: number; isOperational?: boolean },
  req: Request,
  res: Response,
  next: Function
) => {
  console.error(err.stack); // Log the error (optional)

  const statusCode = err.statusCode || 500; // Use custom statusCode if set
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};
