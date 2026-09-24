import type {
  Request,
  Response,
} from "express";
import User from "../Models/user.model.js";
import {
  loginUser,
  registerUser,
  resetUserPassword,
} from "../Services/authService.js";
import {
  createAndSendPasswordResetOTP,
  createAndSendVerificationOTP,
  verifyEmailOTP,
  verifyPasswordResetOTP,
} from "../Services/otpService.js";
import {
  validateForgotPasswordInput,
  validateLoginInput,
  validateRegisterInput,
  validateResetPasswordInput,
  validateVerifyEmailInput,
  validateVerifyResetOTPInput,
} from "../Validators/authValidator.js";

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  const validationError =
    validateRegisterInput(
      req.body
    );

  if (validationError) {
    res.status(400).json({
      success: false,
      message:
        validationError,
      data: null,
    });
    return;
  }

  try {
    const user =
      await registerUser({
        email:
          req.body.email,
        password:
          req.body.password,
      });

    res.status(201).json({
      success: true,
      message:
        "Verification email sent",
      data: {
        user,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "An account with this email already exists"
    ) {
      res.status(409).json({
        success: false,
        message:
          error.message,
        data: null,
      });
      return;
    }

    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Unable to create account or send verification email",
      data: null,
    });
  }
};

export const verifyEmail =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const validationError =
      validateVerifyEmailInput(
        req.body
      );

    if (validationError) {
      res.status(400).json({
        success: false,
        message:
          validationError,
        data: null,
      });
      return;
    }

    try {
      const user =
        await verifyEmailOTP(
          req.body.email,
          req.body.otp
        );

      res.status(200).json({
        success: true,
        message:
          "Email verified successfully",
        data: {
          user,
        },
      });
    } catch (error) {
      if (
        error instanceof Error
      ) {
        const knownErrors = [
          "Invalid verification request",
          "Email is already verified",
          "Verification code is invalid or expired",
          "Invalid verification code",
          "Too many incorrect attempts. Request a new verification code",
        ];

        if (
          knownErrors.includes(
            error.message
          )
        ) {
          res.status(400).json({
            success: false,
            message:
              error.message,
            data: null,
          });
          return;
        }
      }

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Unable to verify email",
        data: null,
      });
    }
  };

export const resendVerification =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const email =
      typeof req.body.email ===
      "string"
        ? req.body.email
            .trim()
            .toLowerCase()
        : "";

    if (
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid email address",
        data: null,
      });
      return;
    }

    try {
      const user =
        await User.findOne({
          email,
        });

      if (!user) {
        res.status(200).json({
          success: true,
          message:
            "If the account exists and requires verification, a verification code will be sent",
          data: null,
        });
        return;
      }

      if (
        user.emailVerified
      ) {
        res.status(400).json({
          success: false,
          message:
            "Email is already verified",
          data: null,
        });
        return;
      }

      await createAndSendVerificationOTP(
        user._id.toString(),
        user.email
      );

      res.status(200).json({
        success: true,
        message:
          "Verification email sent",
        data: null,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith(
          "Please wait"
        )
      ) {
        res.status(429).json({
          success: false,
          message:
            error.message,
          data: null,
        });
        return;
      }

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Unable to resend verification email",
        data: null,
      });
    }
  };

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  const validationError =
    validateLoginInput(
      req.body
    );

  if (validationError) {
    res.status(400).json({
      success: false,
      message:
        validationError,
      data: null,
    });
    return;
  }

  try {
    const result =
      await loginUser({
        email:
          req.body.email,
        password:
          req.body.password,
      });

    res.status(200).json({
      success: true,
      message:
        "Login successful",
      data: result,
    });
  } catch (error) {
    if (
      error instanceof Error
    ) {
      if (
        error.message ===
        "Invalid email or password"
      ) {
        res.status(401).json({
          success: false,
          message:
            error.message,
          data: null,
        });
        return;
      }

      if (
        error.message ===
        "Please verify your email before logging in"
      ) {
        res.status(403).json({
          success: false,
          message:
            error.message,
          data: null,
        });
        return;
      }
    }

    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Unable to log in",
      data: null,
    });
  }
};

export const forgotPassword =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const validationError =
      validateForgotPasswordInput(
        req.body
      );

    if (validationError) {
      res.status(400).json({
        success: false,
        message:
          validationError,
        data: null,
      });
      return;
    }

    const email =
      req.body.email
        .trim()
        .toLowerCase();

    try {
      const user =
        await User.findOne({
          email,
        });

      if (user) {
        await createAndSendPasswordResetOTP(
          user._id.toString(),
          user.email
        );
      }

      res.status(200).json({
        success: true,
        message:
          "If an account exists with that email, a password reset code will be sent",
        data: null,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith(
          "Please wait"
        )
      ) {
        res.status(429).json({
          success: false,
          message:
            error.message,
          data: null,
        });
        return;
      }

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Unable to process password reset request",
        data: null,
      });
    }
  };

export const verifyResetOTP =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const validationError =
      validateVerifyResetOTPInput(
        req.body
      );

    if (validationError) {
      res.status(400).json({
        success: false,
        message:
          validationError,
        data: null,
      });
      return;
    }

    try {
      const result =
        await verifyPasswordResetOTP(
          req.body.email,
          req.body.otp
        );

      res.status(200).json({
        success: true,
        message:
          "Reset code verified",
        data: result,
      });
    } catch (error) {
      if (
        error instanceof Error
      ) {
        const knownErrors = [
          "Invalid password reset request",
          "Reset code is invalid or expired",
          "Invalid reset code",
          "Too many incorrect attempts. Request a new reset code",
        ];

        if (
          knownErrors.includes(
            error.message
          )
        ) {
          res.status(400).json({
            success: false,
            message:
              error.message,
            data: null,
          });
          return;
        }
      }

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Unable to verify reset code",
        data: null,
      });
    }
  };

export const resetPassword =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const validationError =
      validateResetPasswordInput(
        req.body
      );

    if (validationError) {
      res.status(400).json({
        success: false,
        message:
          validationError,
        data: null,
      });
      return;
    }

    try {
      await resetUserPassword(
        req.body.resetToken,
        req.body.newPassword
      );

      res.status(200).json({
        success: true,
        message:
          "Password reset successfully",
        data: null,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        [
          "Invalid or expired reset token",
          "Invalid reset token",
          "User not found",
        ].includes(
          error.message
        )
      ) {
        res.status(400).json({
          success: false,
          message:
            error.message,
          data: null,
        });
        return;
      }

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Unable to reset password",
        data: null,
      });
    }
  };