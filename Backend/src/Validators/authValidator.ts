export interface RegisterInput {
  email: string;
  username: string;
  password: string;
}

export interface VerifyEmailInput {
  email: string;
  otp: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface VerifyResetOTPInput {
  email: string;
  otp: string;
}

export interface ResetPasswordInput {
  resetToken: string;
  newPassword: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegisterInput = (
  data: Partial<RegisterInput>,
): string | null => {
  const { email, username, password } = data;

  if (!email || !emailRegex.test(email)) {
    return "Invalid email address";
  }

  if (!username || username.trim().length === 0) {
    return "Username is required";
  }

  if (username.trim().length > 30) {
    return "Username must be under 30 characters";
  }

  if (!password || password.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (password.length > 72) {
    return "Password must be under 72 characters";
  }

  return null;
};

export const validateVerifyEmailInput = (
  data: Partial<VerifyEmailInput>,
): string | null => {
  const { email, otp } = data;

  if (!email || !emailRegex.test(email)) {
    return "Invalid email address";
  }

  if (!otp || !/^\d{6}$/.test(otp)) {
    return "Verification code must be 6 digits";
  }

  return null;
};

export const validateLoginInput = (
  data: Partial<LoginInput>,
): string | null => {
  const { email, password } = data;

  if (!email || !emailRegex.test(email)) {
    return "Invalid email address";
  }

  if (!password) {
    return "Password is required";
  }

  return null;
};

export const validateForgotPasswordInput = (
  data: Partial<ForgotPasswordInput>,
): string | null => {
  if (!data.email || !emailRegex.test(data.email)) {
    return "Invalid email address";
  }

  return null;
};

export const validateVerifyResetOTPInput = (
  data: Partial<VerifyResetOTPInput>,
): string | null => {
  const { email, otp } = data;

  if (!email || !emailRegex.test(email)) {
    return "Invalid email address";
  }

  if (!otp || !/^\d{6}$/.test(otp)) {
    return "Reset code must be 6 digits";
  }

  return null;
};

export const validateResetPasswordInput = (
  data: Partial<ResetPasswordInput>,
): string | null => {
  const { resetToken, newPassword } = data;

  if (!resetToken) {
    return "Reset token is required";
  }

  if (!newPassword || newPassword.length < 8) {
    return "New password must be at least 8 characters";
  }

  if (newPassword.length > 72) {
    return "New password must be under 72 characters";
  }

  return null;
};
