import { Router } from "express";
import {
  forgotPassword,
  login,
  register,
  resendVerification,
  resetPassword,
  verifyEmail,
  verifyResetOTP,
} from "../Controllers/authController.js";
import {
  authLimiter,
  loginLimiter,
  otpLimiter,
  passwordResetLimiter,
} from "../Middleware/rateLimiter.js";

const router = Router();

router.post(
  "/register",
  authLimiter,
  register
);

router.post(
  "/verify-email",
  otpLimiter,
  verifyEmail
);

router.post(
  "/resend-verification",
  otpLimiter,
  resendVerification
);

router.post(
  "/login",
  loginLimiter,
  login
);

router.post(
  "/forgot-password",
  passwordResetLimiter,
  forgotPassword
);

router.post(
  "/verify-reset-otp",
  otpLimiter,
  verifyResetOTP
);

router.post(
  "/reset-password",
  passwordResetLimiter,
  resetPassword
);

export default router;