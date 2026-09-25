import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";
import type {
  LoginInput,
  RegisterInput,
} from "../Validators/authValidator.js";
import type {
  PasswordResetTokenPayload,
} from "../Types/auth.types.js";
import { createAndSendVerificationOTP } from "./otpService.js";
import { generateAccessToken } from "../Utils/generateToken.js";

export const registerUser = async (
  data: RegisterInput
) => {
  const email =
    data.email.trim().toLowerCase();

  const username = data.username.trim();

  const { password } = data;

  const existingUser =
    await User.findOne({
      email,
    });

  if (existingUser) {
    throw new Error(
      "An account with this email already exists"
    );
  }

  const passwordHash =
    await bcrypt.hash(
      password,
      12
    );

  const user = await User.create({
    email,
    username,
    passwordHash,
    role: "user",
    emailVerified: false,
  });

  try {
    await createAndSendVerificationOTP(
      user._id.toString(),
      user.email
    );
  } catch (error) {
    await User.findByIdAndDelete(
      user._id
    );

    throw error;
  }

  return {
    id: user._id.toString(),
    email: user.email,
    username: user.username,
    role: user.role,
    emailVerified:
      user.emailVerified,
  };
};

export const loginUser = async (
  data: LoginInput
) => {
  const email =
    data.email.trim().toLowerCase();

  const { password } = data;

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Error(
      "Invalid email or password"
    );
  }

  const passwordMatches =
    await bcrypt.compare(
      password,
      user.passwordHash
    );

  if (!passwordMatches) {
    throw new Error(
      "Invalid email or password"
    );
  }

  if (!user.emailVerified) {
    throw new Error(
      "Please verify your email before logging in"
    );
  }

  const accessToken =
    generateAccessToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
      emailVerified:
        user.emailVerified,
    },
    accessToken,
  };
};

export const resetUserPassword =
  async (
    resetToken: string,
    newPassword: string
  ) => {
    const jwtSecret =
      process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error(
        "JWT_SECRET is not defined in the environment variables"
      );
    }

    let decoded:
      | PasswordResetTokenPayload
      | undefined;

    try {
      decoded = jwt.verify(
        resetToken,
        jwtSecret
      ) as PasswordResetTokenPayload;
    } catch {
      throw new Error(
        "Invalid or expired reset token"
      );
    }

    if (
      decoded.purpose !==
      "password_reset"
    ) {
      throw new Error(
        "Invalid reset token"
      );
    }

    const user =
      await User.findById(
        decoded.id
      );

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    const passwordHash =
      await bcrypt.hash(
        newPassword,
        12
      );

    user.passwordHash =
      passwordHash;

    await user.save();

    return {
      id: user._id.toString(),
      email: user.email,
    };
  };