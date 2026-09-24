import type { UserRole } from "../Models/user.model.js";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AccessTokenPayload extends AuthUser {}

export interface PasswordResetTokenPayload {
  id: string;
  email: string;
  purpose: "password_reset";
}