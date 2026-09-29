import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { verifyEmail, resendVerification } from "../../services/authApi";
import logo from "../../assets/images/voxa-logo.png";

function Verification() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!otp.trim()) {
      setError("Please enter the verification code.");
      return;
    }
    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Verification code must be 6 digits.");
      return;
    }

    try {
      setLoading(true);

      await verifyEmail({
        email: email.trim(),
        otp: otp.trim(),
      });

      navigate("/login", {
        state: {
          message: "Email verified successfully. You can now log in.",
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to verify your email. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setResending(true);

      const response = await resendVerification({
        email: email.trim(),
      });

      setMessage(response.message || "A new verification code has been sent.");
      setCountdown(60);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to resend verification code.",
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-[360px] mx-auto">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img src={logo} alt="VOXA" className="h-14 w-auto" />
      </div>

      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-[28px] font-bold text-gray-900">
          Check your email
        </h1>

        <p className="mt-2 text-[13px] text-gray-500">
          We sent a 6-digit code to your email address.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Verification code */}
        <div className="mb-5">
          <label
            htmlFor="otp"
            className="block text-[13px] font-medium text-gray-700 mb-2"
          >
            Verification Code
          </label>

          <input
            id="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={(event) => {
              const value = event.target.value.replace(/\D/g, "");
              setOtp(value);
            }}
            placeholder="Enter 6-digit code"
            className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-sm tracking-[0.25em] outline-none focus:border-blue-500"
          />
        </div>

        {error && <p className="mb-4 text-[12px] text-red-500">{error}</p>}

        {message && (
          <p className="mb-4 text-[12px] text-green-600">{message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 py-3 text-[13px] font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>
      </form>

      <p className="mt-5 text-center text-[12px] text-gray-500">
        Didn't get a code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={resending || countdown > 0}
          className="font-medium text-blue-600 hover:underline disabled:opacity-60"
        >
          {resending
            ? "Sending..."
            : countdown > 0
              ? `Resend in ${countdown}s`
              : "Resend"}
        </button>
      </p>

      <p className="mt-2 text-center text-[12px] text-gray-500">
        Remember your password?{" "}
        <Link to="/login" className="font-medium text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default Verification;
