import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/authApi";
import logo from "../../assets/images/logo.png";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  // This comes from VerifyResetOTP.jsx
  const resetToken = location.state?.resetToken || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!resetToken) {
      setError(
        "Your password reset session is missing or expired. Please request a new code.",
      );
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        resetToken,
        newPassword,
      });

      navigate("/login", {
        state: {
          message: "Password reset successfully. You can now log in.",
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset your password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[360px] mx-auto">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img src={logo} alt="VOXA" className="h-10 w-auto" />
      </div>

      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-[28px] font-bold text-gray-900">
          Set a new password
        </h1>

        <p className="mt-2 text-[13px] text-gray-500">
          Choose a strong password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* New Password */}
        <div className="mb-6">
          <label
            htmlFor="newPassword"
            className="block text-[13px] font-medium text-gray-700 mb-2"
          >
            New Password
          </label>

          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            autoComplete="new-password"
            className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-7">
          <label
            htmlFor="confirmPassword"
            className="block text-[13px] font-medium text-gray-700 mb-2"
          >
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {error && <p className="mb-4 text-[12px] text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 py-3 text-[13px] font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <p className="mt-5 text-center text-[12px] text-gray-500">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default ResetPassword;
