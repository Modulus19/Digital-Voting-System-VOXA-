import Modal from "./Modal";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
}) {

  const confirmStyles = {
    primary: "bg-blue-600 hover:bg-blue-700",
    danger: "bg-red-500 hover:bg-red-600",
    neutral: "bg-slate-700 hover:bg-slate-800",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-sm text-slate-600 mb-6">
        {message}
      </p>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-slate-700 hover:bg-gray-50"
        >
          {cancelText}
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className={`
            rounded-lg px-4 py-2
            text-sm font-semibold text-white
            transition-colors
            ${confirmStyles[variant] ?? confirmStyles.primary}
          `}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}