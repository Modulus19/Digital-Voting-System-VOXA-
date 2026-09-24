import { rateLimit } from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again later",
    data: null,
  },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many login attempts. Please try again later",
    data: null,
  },
});

export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many OTP requests. Please try again later",
    data: null,
  },
});

export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many password reset requests. Please try again later",
    data: null,
  },
});