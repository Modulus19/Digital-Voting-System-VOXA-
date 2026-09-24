import OTP from "../Models/OTP.js";
import User from "../Models/user.model.js";
import { generateOTP } from "../Utils/generateOTP.js";
import { compareOTP, hashOTP } from "../Utils/hashOTP.js";
import { generatePasswordResetToken } from "../Utils/generateToken.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "./emailService.js";

const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;
const RESEND_COOLDOWN_SECONDS = 60;

export const createAndSendVerificationOTP = async (
  userId: string,
  email: string
): Promise<void> => {
  const normalizedEmail =
    email.trim().toLowerCase();

  const previousOTP = await OTP.findOne({
    user: userId,
    purpose: "email_verification",
  }).sort({
    createdAt: -1,
  });

  if (previousOTP) {
    const secondsSinceLastOTP =
      (Date.now() -
        previousOTP.createdAt.getTime()) /
      1000;

    if (
      secondsSinceLastOTP <
      RESEND_COOLDOWN_SECONDS
    ) {
      const remainingSeconds = Math.ceil(
        RESEND_COOLDOWN_SECONDS -
          secondsSinceLastOTP
      );

      throw new Error(
        `Please wait ${remainingSeconds} seconds before requesting another code`
      );
    }
  }

  await OTP.deleteMany({
    user: userId,
    purpose: "email_verification",
  });

  const otp = generateOTP();
  const otpHash = await hashOTP(otp);

  const expiresAt = new Date(
    Date.now() +
      OTP_EXPIRY_MINUTES * 60 * 1000
  );

  const otpRecord = await OTP.create({
    user: userId,
    email: normalizedEmail,
    otpHash,
    purpose: "email_verification",
    attempts: 0,
    expiresAt,
  });

  try {
    await sendVerificationEmail(
      normalizedEmail,
      otp
    );
  } catch (error) {
    await OTP.findByIdAndDelete(
      otpRecord._id
    );

    throw error;
  }
};

export const verifyEmailOTP = async (
  email: string,
  otp: string
) => {
  const normalizedEmail =
    email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    throw new Error(
      "Invalid verification request"
    );
  }

  if (user.emailVerified) {
    throw new Error(
      "Email is already verified"
    );
  }

  const otpRecord = await OTP.findOne({
    user: user._id,
    email: normalizedEmail,
    purpose: "email_verification",
  }).sort({
    createdAt: -1,
  });

  if (!otpRecord) {
    throw new Error(
      "Verification code is invalid or expired"
    );
  }

  if (
    otpRecord.expiresAt.getTime() <
    Date.now()
  ) {
    await OTP.findByIdAndDelete(
      otpRecord._id
    );

    throw new Error(
      "Verification code is invalid or expired"
    );
  }

  if (
    otpRecord.attempts >=
    MAX_OTP_ATTEMPTS
  ) {
    await OTP.findByIdAndDelete(
      otpRecord._id
    );

    throw new Error(
      "Too many incorrect attempts. Request a new verification code"
    );
  }

  const isValid = await compareOTP(
    otp,
    otpRecord.otpHash
  );

  if (!isValid) {
    otpRecord.attempts += 1;
    await otpRecord.save();

    throw new Error(
      "Invalid verification code"
    );
  }

  user.emailVerified = true;
  await user.save();

  await OTP.deleteMany({
    user: user._id,
    purpose: "email_verification",
  });

  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
  };
};

export const createAndSendPasswordResetOTP =
  async (
    userId: string,
    email: string
  ): Promise<void> => {
    const normalizedEmail =
      email.trim().toLowerCase();

    const previousOTP = await OTP.findOne({
      user: userId,
      purpose: "password_reset",
    }).sort({
      createdAt: -1,
    });

    if (previousOTP) {
      const secondsSinceLastOTP =
        (Date.now() -
          previousOTP.createdAt.getTime()) /
        1000;

      if (
        secondsSinceLastOTP <
        RESEND_COOLDOWN_SECONDS
      ) {
        const remainingSeconds =
          Math.ceil(
            RESEND_COOLDOWN_SECONDS -
              secondsSinceLastOTP
          );

        throw new Error(
          `Please wait ${remainingSeconds} seconds before requesting another code`
        );
      }
    }

    await OTP.deleteMany({
      user: userId,
      purpose: "password_reset",
    });

    const otp = generateOTP();
    const otpHash = await hashOTP(otp);

    const expiresAt = new Date(
      Date.now() +
        OTP_EXPIRY_MINUTES *
          60 *
          1000
    );

    const otpRecord = await OTP.create({
      user: userId,
      email: normalizedEmail,
      otpHash,
      purpose: "password_reset",
      attempts: 0,
      expiresAt,
    });

    try {
      await sendPasswordResetEmail(
        normalizedEmail,
        otp
      );
    } catch (error) {
      await OTP.findByIdAndDelete(
        otpRecord._id
      );

      throw error;
    }
  };

export const verifyPasswordResetOTP =
  async (
    email: string,
    otp: string
  ) => {
    const normalizedEmail =
      email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      throw new Error(
        "Invalid password reset request"
      );
    }

    const otpRecord = await OTP.findOne({
      user: user._id,
      email: normalizedEmail,
      purpose: "password_reset",
    }).sort({
      createdAt: -1,
    });

    if (!otpRecord) {
      throw new Error(
        "Reset code is invalid or expired"
      );
    }

    if (
      otpRecord.expiresAt.getTime() <
      Date.now()
    ) {
      await OTP.findByIdAndDelete(
        otpRecord._id
      );

      throw new Error(
        "Reset code is invalid or expired"
      );
    }

    if (
      otpRecord.attempts >=
      MAX_OTP_ATTEMPTS
    ) {
      await OTP.findByIdAndDelete(
        otpRecord._id
      );

      throw new Error(
        "Too many incorrect attempts. Request a new reset code"
      );
    }

    const isValid = await compareOTP(
      otp,
      otpRecord.otpHash
    );

    if (!isValid) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      throw new Error(
        "Invalid reset code"
      );
    }

    await OTP.deleteMany({
      user: user._id,
      purpose: "password_reset",
    });

    const resetToken =
      generatePasswordResetToken({
        id: user._id.toString(),
        email: user.email,
        purpose: "password_reset",
      });

    return {
      resetToken,
    };
  };