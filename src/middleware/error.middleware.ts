import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { Prisma } from "../generated/prisma/client.js";
import { OrderCreationError } from "../services/order/order.service.js";

export const notFoundHandler = (req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const globalErrorHandler: ErrorRequestHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof OrderCreationError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaErrors: Record<string, { status: number; message: string }> = {
      P2002: {
        status: 409,
        message: "A record with the provided unique value already exists",
      },
      P2003: {
        status: 409,
        message: "The request conflicts with a related record",
      },
      P2014: {
        status: 409,
        message: "The request would violate a required relation",
      },
      P2015: {
        status: 404,
        message: "A related record was not found",
      },
      P2023: {
        status: 400,
        message: "The request contains an invalid value",
      },
      P2025: {
        status: 404,
        message: "Record not found",
      },
    };
    const mappedError = prismaErrors[error.code];

    if (mappedError) {
      res.status(mappedError.status).json({
        success: false,
        message: mappedError.message,
      });
      return;
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      message: "Invalid database request",
    });
    return;
  }

  if (
    error instanceof SyntaxError &&
    "status" in error &&
    error.status === 400
  ) {
    res.status(400).json({
      success: false,
      message: "Invalid JSON body",
    });
    return;
  }

  console.error(error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
