import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginRequest } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/images/voxa-logo.png";
import { Icon } from "@iconify/react";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

    if (!formData.email.trim() || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await loginRequest({
        email: formData.email.trim(),
        password: formData.password,
      });

      const user = response.data.user;
      const accessToken = response.data.accessToken;

      login(user, accessToken);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/polls");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to log in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img src={logo} alt="VOXA" className="h-14 w-auto" />
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>

        <div className="flex items-center gap-4 mt-5">
          <div className="h-px flex-1 bg-gray-300"></div>

          <span className="text-sm text-gray-500 whitespace-nowrap">
            Login with email
          </span>

          <div className="h-px flex-1 bg-gray-300"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="mb-7">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-800 mb-2"
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
        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-800 mb-2"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="e.g Ad123"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 pr-10 text-sm outline-none focus:border-blue-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Icon
                icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                className="text-xl text-gray-500"
              />
            </button>
          </div>
        </div>

        {/* Remember / Forgot password */}
        <div className="flex items-center justify-between mb-8 text-sm">
          <label className="flex items-center gap-2 text-gray-600">
            <input
              type="checkbox"
              checked={keepLoggedIn}
              onChange={(event) => setKeepLoggedIn(event.target.checked)}
            />
            Keep me logged in
          </label>

          <Link
            to="/forgot-password"
            className="font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary py-3 text-sm font-semibold text-text-inverse transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="mt-5 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
