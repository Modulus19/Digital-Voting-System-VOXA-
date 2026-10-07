import { useEffect, useState } from "react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer;

    if (isOpen) {
      timer = setTimeout(() => {
        setShouldRender(true);

        requestAnimationFrame(() => {
          setVisible(true);
        });
      }, 0);
    } else {
      setVisible(false);

      timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40
        transition-opacity duration-300 ease-out
        ${visible ? "opacity-100" : "opacity-0"}
      `}
      onClick={onClose}
    >
      <div
        className={`
          w-full max-w-md rounded-2xl bg-white p-6
          transform-gpu
          transition-all duration-300 ease-out
          ${
            visible
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-3 scale-95 opacity-0"
          }
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            {title}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-slate-400 transition-colors duration-200 hover:text-slate-600"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}