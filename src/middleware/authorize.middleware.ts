import { NextFunction, Request, Response } from "express";

export const authorize = (...allowedRoles: ("USER" | "ADMIN")[]) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };
};
