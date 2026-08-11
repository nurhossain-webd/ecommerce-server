import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const auth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization header must use the Bearer scheme",
    });
  }

  const token = authHeader.slice(7).trim();

  if (!token || token.includes(" ")) {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token",
    });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return next(new Error("JWT_SECRET is not configured"));
  }

  let decoded: jwt.JwtPayload | string;

  try {
    decoded = jwt.verify(token, jwtSecret);

    if (
      typeof decoded === "string" ||
      typeof decoded.id !== "string" ||
      (decoded.role !== "USER" && decoded.role !== "ADMIN")
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  prisma.user
    .findFirst({
      where: {
        id: decoded.id,
        isDeleted: false,
      },
      select: {
        id: true,
        role: true,
      },
    })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User is no longer active",
        });
      }

      req.user = user;
      next();
    })
    .catch(next);
};
