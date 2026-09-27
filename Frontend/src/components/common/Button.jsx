export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
  fullWidth = false,
  loading = false,
}) {
  const base =
    "rounded-lg font-semibold text-sm px-5 py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    outline:
      "bg-white text-slate-900 border border-gray-200 hover:bg-gray-50",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${
        fullWidth ? "w-full" : ""
      }`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}