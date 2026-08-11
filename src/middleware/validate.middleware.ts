import { NextFunction, Request, Response } from "express";
import { type ZodType } from "zod";

type RequestSchemas = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

export const validateRequest = (schemas: RequestSchemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const location of ["params", "query", "body"] as const) {
      const schema = schemas[location];

      if (!schema) {
        continue;
      }

      const result = schema.safeParse(req[location]);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: result.error.issues.map((issue) => ({
            field: [location, ...issue.path].join("."),
            message: issue.message,
          })),
        });
      }

      if (location === "body") {
        req.body = result.data;
      }
    }

    next();
  };
};
