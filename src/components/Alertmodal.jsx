import { useEffect, useRef } from "react";

const TYPES = {
  warning: {
    icon: "fa-triangle-exclamation",
    bg: "bg-amber-100",
    fg: "text-amber-600",
  },
  error: {
    icon: "fa-circle-exclamation",
    bg: "bg-red-100",
    fg: "text-red-600",
  },
  info: { icon: "fa-circle-info", bg: "bg-blue-100", fg: "text-[#4169E1]" },
  success: {
    icon: "fa-circle-check",
    bg: "bg-green-100",
    fg: "text-green-600",
  },
};

/**
 * Custom replacement for window.alert().
 *
 * <AlertModal
 *   isOpen={open}
 *   onClose={() => setOpen(false)}
 *   title="Heads up"
 *   message="Something needs your attention."
 *   type="warning"            // warning | error | info | success
 *   buttonText="Got it"       // optional
 * />
 */
export default function AlertModal({
  isOpen,
  onClose,
  title = "Notice",
  message = "",
  type = "warning",
  buttonText = "Got it",
}) {
  const buttonRef = useRef(null);
  const t = TYPES[type] || TYPES.warning;

  useEffect(() => {
    if (!isOpen) return;
    buttonRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-modal-title"
        aria-describedby="alert-modal-message"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center"
      >
        <div
          className={`w-14 h-14 rounded-full ${t.bg} flex items-center justify-center mx-auto mb-4`}
        >
          <i className={`fas ${t.icon} text-2xl ${t.fg}`}></i>
        </div>
        <h3
          id="alert-modal-title"
          className="text-xl font-bold text-gray-900 mb-2"
        >
          {title}
        </h3>
        <p id="alert-modal-message" className="text-gray-600 mb-6">
          {message}
        </p>
        <button
          ref={buttonRef}
          type="button"
          onClick={onClose}
          className="w-full bg-[#4169E1] hover:bg-[#3658c9] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
