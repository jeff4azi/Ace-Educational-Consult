import { useState, useEffect, useRef } from "react";

const LS_KEY = "ace_whatsapp_number";

/**
 * Converts a Nigerian phone number to international WhatsApp format.
 * Accepts: 08012345678, 8012345678, +2348012345678, 2348012345678
 * Returns: "2348012345678" (no + prefix, as wa.me expects)
 */
export function toWaNumber(raw) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("234")) return digits;
  if (digits.startsWith("0")) return "234" + digits.slice(1);
  if (digits.length === 10) return "234" + digits; // e.g. 8012345678
  return digits;
}

/**
 * Returns the stored WhatsApp number from localStorage, or null.
 */
export function getStoredWaNumber() {
  try {
    return localStorage.getItem(LS_KEY) || null;
  } catch {
    return null;
  }
}

/**
 * Saves a WhatsApp number (in wa.me format) to localStorage.
 */
export function saveWaNumber(raw) {
  try {
    localStorage.setItem(LS_KEY, toWaNumber(raw));
  } catch {
    /* ignore */
  }
}

/**
 * Formats a stored wa.me number back to a readable Nigerian local format.
 * "2348012345678" → "08012345678"
 */
export function formatDisplayNumber(waNumber) {
  if (!waNumber) return "";
  const digits = waNumber.replace(/\D/g, "");
  if (digits.startsWith("234")) return "0" + digits.slice(3);
  return waNumber;
}

/**
 * Modal that collects the user's WhatsApp number.
 * Props:
 *   onConfirm(waNumber: string) — called with the wa.me-formatted number
 *   onClose() — called if the user dismisses without saving
 */
export default function WhatsAppModal({ onConfirm, onClose }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    // Autofocus input when modal mounts
    inputRef.current?.focus();

    // Prevent background scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const validate = (raw) => {
    const digits = raw.replace(/\D/g, "");
    // After stripping country code we expect 10 local digits (07x/08x/09x)
    // Acceptable inputs: 08012345678 (11 digits), 8012345678 (10 digits),
    // 2348012345678 (13 digits), +2348012345678 (13 digits)
    if (digits.length === 0) return "Please enter your WhatsApp number.";
    if (
      digits.length !== 11 && // 08012345678
      digits.length !== 10 && // 8012345678
      digits.length !== 13 // 2348012345678
    ) {
      return "Enter a valid Nigerian number (e.g. 08012345678).";
    }
    return "";
  };

  const handleConfirm = () => {
    const err = validate(value);
    if (err) {
      setError(err);
      return;
    }
    const waNumber = toWaNumber(value);
    saveWaNumber(value);
    onConfirm(waNumber);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleConfirm();
    if (e.key === "Escape") onClose();
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Panel */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in">
        {/* Icon + heading */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-14 h-14 bg-[#25D366]/10 rounded-2xl flex items-center justify-center mb-3">
            <i className="fab fa-whatsapp text-[#25D366] text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Your WhatsApp Number
          </h2>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            We'll use this to contact you about your order. It's saved on this
            device so you won't be asked again.
          </p>
        </div>

        {/* Input */}
        <div className="space-y-1 mb-4">
          <label className="block text-sm font-medium text-gray-700">
            WhatsApp Number <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#25D366] focus-within:ring-2 focus-within:ring-[#25D366]/20 transition-all">
            <span className="px-3 py-3 bg-gray-50 text-gray-500 text-sm border-r border-gray-200 shrink-0">
              🇳🇬 +234
            </span>
            <input
              ref={inputRef}
              type="tel"
              inputMode="numeric"
              placeholder="08012345678"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3 py-3 text-sm focus:outline-none bg-white"
            />
          </div>
          {error && (
            <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
              <i className="fas fa-circle-exclamation" /> {error}
            </p>
          )}
        </div>

        {/* Actions */}
        <button
          onClick={handleConfirm}
          className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 mb-2"
        >
          <i className="fab fa-whatsapp text-base" />
          Save & Continue
        </button>
        <button
          onClick={onClose}
          className="w-full text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
