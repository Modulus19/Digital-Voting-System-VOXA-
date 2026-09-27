import { useState } from "react";
import { Icon } from "@iconify/react";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  name,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  const inputType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block text-xs text-slate-500 mb-1.5"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full h-11 rounded-lg border px-3.5 ${
            isPassword ? "pr-11" : ""
          } text-sm text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : "border-gray-200"
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <Icon
              icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
              width="20"
            />
          </button>
        )}
      </div>

      {error && (
        <span className="text-xs text-red-500 mt-1 block">
          {error}
        </span>
      )}
    </div>
  );
}