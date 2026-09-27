export default function Toast({ message, type = "success", onClose }) {
  const styles = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 ${styles[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm`}
      role="alert"
    >
      <span>{message}</span>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="opacity-80 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}