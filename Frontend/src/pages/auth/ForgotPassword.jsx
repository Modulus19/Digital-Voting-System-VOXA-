import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/authApi";
import logo from "../../assets/images/logo.png";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      await forgotPassword({
        email: email.trim(),
      });

      navigate("/verify-reset-otp", {
        state: {
          email: email.trim(),
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to send reset code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Logo */}
      <div className="flex justify-center mb-5">
        <img src={logo} alt="VOXA" className="h-14 w-auto" />
      </div>

      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Reset your password
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter your email and we'll send you a code to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="mb-7">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-800 mb-1"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            autoComplete="email"
            className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Code"}
        </button>

        <p className="mt-5 text-center text-sm text-gray-500">
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

export default ForgotPassword;
