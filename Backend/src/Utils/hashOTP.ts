import bcrypt from "bcryptjs";

export const hashOTP = async (otp: string): Promise<string> => {
  return bcrypt.hash(otp, 10);
};

export const compareOTP = async (
  otp: string,
  otpHash: string
): Promise<boolean> => {
  return bcrypt.compare(otp, otpHash);
};