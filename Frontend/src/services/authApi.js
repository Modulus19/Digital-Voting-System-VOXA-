import api from "./api";

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const verifyEmail = async (verificationData) => {
  const response = await api.post("/auth/verify-email", verificationData);
  return response.data;
};

export const resendVerification = async (emailData) => {
  const response = await api.post("/auth/resend-verification", emailData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const forgotPassword = async (emailData) => {
  const response = await api.post("/auth/forgot-password", emailData);
  return response.data;
};

export const verifyResetOTP = async (otpData) => {
  const response = await api.post("/auth/verify-reset-otp", otpData);
  return response.data;
};

export const resetPassword = async (resetData) => {
  const response = await api.post("/auth/reset-password", resetData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
