import Ajv from "ajv";
import addFormats from "ajv-formats";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET as string;
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

// response serialization middleware
export const serializeResponse = (schema: any) => {
  const validate = ajv.compile(schema);
  return (req: Request, res: Response, next: NextFunction) => {
    const oldJson = res.json.bind(res);
    res.json = (body: any) => {
      const valid = validate(body);
      if (!valid) {
        console.error("Response validation failed:", validate.errors);
        // Optionally throw an error or modify response
      }
      return oldJson(body);
    };
    next();
  };
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

// jwt authentication middleware
interface JwtPayload {
  userId: number;
  email?: string;
}

// Extend Express Request type to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next(); // proceed to route handler
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
