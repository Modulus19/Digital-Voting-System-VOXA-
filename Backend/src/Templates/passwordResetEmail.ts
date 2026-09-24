export const passwordResetEmailTemplate = (
  otp: string
): string => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Reset your VOXA password</h2>

      <p>
        Use the password reset code below:
      </p>

      <h1 style="letter-spacing: 6px;">
        ${otp}
      </h1>

      <p>
        This code expires in 10 minutes.
      </p>

      <p>
        If you did not request a password reset,
        you can ignore this email.
      </p>
    </div>
  `;
};