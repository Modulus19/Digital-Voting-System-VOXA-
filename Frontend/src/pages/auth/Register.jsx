import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authApi";
import logo from "../../assets/images/voxa-logo.png";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Basic frontend validation
    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }
    if (formData.username.trim().length > 30) {
      setError("Username must be under 30 characters.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (formData.password.length > 72) {
      setError("Password must be under 72 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      // Go to email verification and carry the email with us.
      navigate("/verification", {
        state: {
          email: formData.email.trim(),
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create account. Please try again.",
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
          Create your account
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className="mb-5">
          <label
            htmlFor="username"
            className="block text-sm font-semibold text-gray-800 mb-1"
          >
            Username
          </label>

          <input
            id="username"
            type="text"
            name="username"
            placeholder="e.g William Obi"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
            className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-800 mb-1"
          >
            Email Address
          </label>

          <input
            id="email"
            type="email"
            name="email"
            placeholder="e.g Ad01@gmail.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-800 mb-1"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            name="password"
            placeholder="e.g Ad123"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-7">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-semibold text-gray-800 mb-1"
          >
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Error */}
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
