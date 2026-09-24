import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { AccessTokenPayload } from "../Types/auth.types.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
      data: null,
    });
    return;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({
      success: false,
      message: "Invalid authorization header",
      data: null,
    });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as AccessTokenPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
      data: null,
    });
  }
};