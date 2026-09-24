import nodemailer from "nodemailer";
import { passwordResetEmailTemplate } from "../Templates/passwordResetEmail.js";
import { verificationEmailTemplate } from "../Templates/verificationEmail.js";

const getTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT);
  const user = process.env.EMAIL_USER;
  const password = process.env.EMAIL_PASSWORD;

  if (!host || !port || !user || !password) {
    throw new Error("Email configuration is incomplete");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass: password,
    },
  });
};

export const sendVerificationEmail = async (
  email: string,
  otp: string
): Promise<void> => {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"VOXA" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your VOXA account",
    html: verificationEmailTemplate(otp),
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  otp: string
): Promise<void> => {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"VOXA" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your VOXA password",
    html: passwordResetEmailTemplate(otp),
  });
};