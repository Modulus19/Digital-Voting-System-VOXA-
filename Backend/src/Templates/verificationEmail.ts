export const verificationEmailTemplate = (
  otp: string
): string => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Verify your VOXA account</h2>

      <p>Use the verification code below to verify your email address:</p>

      <h1 style="letter-spacing: 6px;">
        ${otp}
      </h1>

      <p>This code expires in 10 minutes.</p>

      <p>
        If you did not create a VOXA account, you can ignore this email.
      </p>
    </div>
  `;
};