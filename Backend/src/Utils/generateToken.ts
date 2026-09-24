import jwt, { type SignOptions } from "jsonwebtoken";
import type {
  AccessTokenPayload,
  PasswordResetTokenPayload,
} from "../Types/auth.types.js";

const getJwtSecret = (): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error(
      "JWT_SECRET is not defined in the environment variables"
    );
  }

  return jwtSecret;
};

export const generateAccessToken = (
  payload: AccessTokenPayload,
  expiresIn: SignOptions["expiresIn"] = "15m"
): string => {
  return jwt.sign(
    payload,
    getJwtSecret(),
    {
      expiresIn,
    }
  );
};

export const generatePasswordResetToken = (
  payload: PasswordResetTokenPayload
): string => {
  return jwt.sign(
    payload,
    getJwtSecret(),
    {
      expiresIn: "10m",
    }
  );
};