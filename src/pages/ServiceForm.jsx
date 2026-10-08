import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import AceLogo from "../assets/Ace-Educational-Consult-Logo.png";
import { uploadOrderFile } from "../lib/imageUpload";
import { useAdmin } from "../contexts/AdminContext";
import WhatsAppModal, { getStoredWaNumber } from "../components/WhatsAppModal";
import AlertModal from "../components/AlertModal";

const PENDING_ORDER_KEY = "ace_pending_order";

function parsePrice(priceStr) {
  const num = parseFloat(String(priceStr || "").replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
}
function formatNaira(value) {
  return `₦${value.toLocaleString()}`;
}

export default function ServiceForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId } = useParams();
  const { loading, findServiceById } = useAdmin();
  const [form, setForm] = useState({});
  const [filePreviews, setFilePreviews] = useState({});
  const [uploading, setUploading] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});
  const [conditionalAnswers, setConditionalAnswers] = useState({});
  // Custom alert (replaces window.alert)
  const [alertState, setAlertState] = useState({
    open: false,
    title: "",
    message: "",
    type: "warning",
  });
  const showAlert = (title, message, type = "warning") =>
    setAlertState({ open: true, title, message, type });
  const closeAlert = () => setAlertState((p) => ({ ...p, open: false }));
  // true = "Yes, I have it" (no fee) | false/undefined = "No" (fee applies)
  const [resolvedService, setResolvedService] = useState(
    location.state?.service || null,
  );
  const [resolving, setResolving] = useState(
    !location.state?.service && !!serviceId,
  );
  // WhatsApp modal — shown once before the user proceeds to payment
  const [showWaModal, setShowWaModal] = useState(false);
  // Holds the built pendingOrder while waiting for the modal to confirm
  const [pendingOrderDraft, setPendingOrderDraft] = useState(null);

  useEffect(() => {
    if (!resolving || loading) return;
    const found = serviceId ? findServiceById(serviceId) : null;
    if (found) {
      setResolvedService(found);
    }
    setResolving(false);
  }, [resolving, loading, serviceId, findServiceById]);

  useEffect(() => {
    if (!resolvedService) return;

    const service = resolvedService;
    const title = `${service.name} | Ace Educational Consult`;
    const description =
      service.description && service.description.trim().length > 0
        ? service.description
        : `${service.name} — Premium educational service at Ace Educational Consult.`;
    const url = `${window.location.origin}${window.location.pathname}`;
    const image =
      service.image || `${window.location.origin}/android-chrome-512x512.png`;

    document.title = title;

    const setMeta = (selector, attr, name, content) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        if (attr === "property") el.setAttribute("property", name);
        else el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:type"]', "property", "og:type", "product");
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description,
    );
    setMeta('meta[property="og:image"]', "property", "og:image", image);
    setMeta('meta[name="twitter:url"]', "name", "twitter:url", url);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      description,
    );
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
  }, [resolvedService]);

  const handleFileChange = async (fieldName, file) => {
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) =>
        setFilePreviews((prev) => ({ ...prev, [fieldName]: e.target.result }));
      reader.readAsDataURL(file);
    } else {
      setFilePreviews((prev) => ({ ...prev, [fieldName]: file.name }));
    }

    setUploadErrors((prev) => ({ ...prev, [fieldName]: null }));
    setUploading((prev) => ({ ...prev, [fieldName]: true }));
    setForm((prev) => ({ ...prev, [fieldName]: null }));

    try {
      const publicUrl = await uploadOrderFile(file);
      setForm((prev) => ({ ...prev, [fieldName]: publicUrl }));
    } catch {
      setUploadErrors((prev) => ({
        ...prev,
        [fieldName]: "Upload failed. Please try again.",
      }));
      setFilePreviews((prev) => ({ ...prev, [fieldName]: null }));
    } finally {
      setUploading((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const conditionalFields = (resolvedService?.fields || []).filter(
    (f) => f.hasFee,
  );
  const baseValue = resolvedService ? parsePrice(resolvedService.price) : 0;

  // Build live price breakdown snapshot
  const priceBreakdown = [];
  if (resolvedService) {
    priceBreakdown.push({
      label: `Base Price (${resolvedService.name})`,
      amount: baseValue,
    });

    (resolvedService.fields || []).forEach((field) => {
      if (field.type === "radio") {
        const selectedLabel = form[field.name];
        if (selectedLabel) {
          const matchedOpt = (field.options || []).find(
            (o) => o.label === selectedLabel,
          );
          if (matchedOpt && Number(matchedOpt.price) > 0) {
            priceBreakdown.push({
              label: `${field.name}: ${matchedOpt.label}`,
              amount: Number(matchedOpt.price),
            });
          }
        }
      } else if (field.type === "checkbox") {
        const selectedLabels = Array.isArray(form[field.name])
          ? form[field.name]
          : [];
        selectedLabels.forEach((label) => {
          const matchedOpt = (field.options || []).find(
            (o) => o.label === label,
          );
          if (matchedOpt && Number(matchedOpt.price) > 0) {
            priceBreakdown.push({
              label: `${field.name}: ${matchedOpt.label}`,
              amount: Number(matchedOpt.price),
            });
          }
        });
      } else if (field.hasFee) {
        const saidNo = conditionalAnswers[field.name] === false;
        if (saidNo && Number(field.extraPrice) > 0) {
          priceBreakdown.push({
            label: `Missing ${field.name} fee`,
            amount: Number(field.extraPrice),
          });
        }
      }
    });
  }

  const totalValue = priceBreakdown.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0,
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.values(uploading).some(Boolean)) {
      showAlert(
        "Upload in progress",
        "Please wait for all files to finish uploading.",
        "info",
      );
      return;
    }

    const service = resolvedService;

    // Validate required fields manually (especially checkbox and radio)
    for (const field of service.fields || []) {
      if (field.type === "checkbox") {
        const selected = form[field.name];
        if (
          field.required &&
          (!Array.isArray(selected) || selected.length === 0)
        ) {
          showAlert(
            "Selection required",
            `Please select at least one option for "${field.name}".`,
            "warning",
          );
          return;
        }
      } else if (field.type === "radio") {
        const selected = form[field.name];
        if (field.required && !selected) {
          showAlert(
            "Selection required",
            `Please select an option for "${field.name}".`,
            "warning",
          );
          return;
        }
      } else if (field.hasFee) {
        // Checked in conditionalFields below
      } else if (field.required) {
        if (!form[field.name]) {
          showAlert(
            "Required field",
            `Please provide "${field.name}".`,
            "warning",
          );
          return;
        }
      }
    }

    // Every fee question must be answered (Yes or No) before continuing
    const unanswered = conditionalFields.find(
      (f) => conditionalAnswers[f.name] === undefined,
    );
    if (unanswered) {
      showAlert(
        "Answer required",
        `Please answer: "Do you already have your ${unanswered.name}?"`,
        "warning",
      );
      return;
    }

    // Build the pending order object with snapshot breakdown
    const pendingOrder = {
      serviceId: service.id,
      service: {
        id: service.id,
        name: service.name,
        price: service.price,
        fields: service.fields,
      },
      formData: form,
      finalPriceValue: totalValue,
      finalPriceDisplay: formatNaira(totalValue),
      priceBreakdown: priceBreakdown,
      savedAt: Date.now(),
    };

    const storedWaNumber = getStoredWaNumber();

    if (storedWaNumber) {
      // Already have a number — attach it and go straight to payment
      pendingOrder.whatsappNumber = storedWaNumber;
      try {
        localStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(pendingOrder));
      } catch {
        /* ignore */
      }
      navigate("/payment", { state: { pendingOrder } });
    } else {
      // No number yet — show the modal first, hold the draft
      setPendingOrderDraft(pendingOrder);
      setShowWaModal(true);
    }
  };

  const handleWaConfirm = (waNumber) => {
    setShowWaModal(false);
    const pendingOrder = { ...pendingOrderDraft, whatsappNumber: waNumber };
    try {
      localStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(pendingOrder));
    } catch {
      /* ignore */
    }
    navigate("/payment", { state: { pendingOrder } });
  };

  const handleWaSkip = () => {
    setShowWaModal(false);
    const pendingOrder = { ...pendingOrderDraft };
    try {
      localStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(pendingOrder));
    } catch {
      /* ignore */
    }
    navigate("/payment", { state: { pendingOrder } });
  };

  if (loading || resolving) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-5xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Loading service...</p>
        </div>
      </div>
    );
  }

  if (!resolvedService) {
    navigate("/");
    return null;
  }

  const service = resolvedService;

  const renderFieldControl = (field, index) => {
    const value = form[field.name] || "";
    const isUploading = uploading[field.name];
    const uploadError = uploadErrors[field.name];
    const preview = filePreviews[field.name];
    const handleChange = (val) =>
      setForm((prev) => ({ ...prev, [field.name]: val }));

    const inputClass =
      "w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20";

    switch (field.type) {
      case "radio":
        return (
          <div key={index} className="space-y-2.5">
            <label className="block text-sm font-semibold text-gray-800">
              {field.name}
              {field.required ? (
                <span className="text-red-500 ml-1">*</span>
              ) : (
                <span className="text-xs text-gray-400 font-normal ml-1">
                  (optional)
                </span>
              )}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(field.options || []).map((opt, optIdx) => {
                const isSelected = form[field.name] === opt.label;
                const optFee = Number(opt.price) || 0;
                return (
                  <div
                    key={optIdx}
                    onClick={() => handleChange(opt.label)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#4169E1] bg-blue-50/60 shadow-sm ring-1 ring-[#4169E1]/30"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? "border-[#4169E1] bg-[#4169E1]"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isSelected
                            ? "text-[#4169E1] font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        {opt.label}
                      </span>
                    </div>
                    {optFee > 0 && (
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isSelected
                            ? "bg-[#4169E1] text-white"
                            : "bg-blue-50 text-[#4169E1] border border-blue-200"
                        }`}
                      >
                        +{formatNaira(optFee)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "checkbox": {
        const currentSelections = Array.isArray(form[field.name])
          ? form[field.name]
          : [];
        const toggleCheckbox = (label) => {
          setForm((prev) => {
            const list = Array.isArray(prev[field.name])
              ? [...prev[field.name]]
              : [];
            const exists = list.includes(label);
            const updated = exists
              ? list.filter((item) => item !== label)
              : [...list, label];
            return { ...prev, [field.name]: updated };
          });
        };

        return (
          <div key={index} className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-800">
                {field.name}
                {field.required ? (
                  <span className="text-red-500 ml-1">*</span>
                ) : (
                  <span className="text-xs text-gray-400 font-normal ml-1">
                    (select all that apply)
                  </span>
                )}
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(field.options || []).map((opt, optIdx) => {
                const isChecked = currentSelections.includes(opt.label);
                const optFee = Number(opt.price) || 0;
                return (
                  <div
                    key={optIdx}
                    onClick={() => toggleCheckbox(opt.label)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? "border-[#4169E1] bg-blue-50/60 shadow-sm ring-1 ring-[#4169E1]/30"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                          isChecked
                            ? "border-[#4169E1] bg-[#4169E1] text-white"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isChecked && (
                          <i className="fas fa-check text-[10px]"></i>
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isChecked
                            ? "text-[#4169E1] font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        {opt.label}
                      </span>
                    </div>
                    {optFee > 0 && (
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isChecked
                            ? "bg-[#4169E1] text-white"
                            : "bg-blue-50 text-[#4169E1] border border-blue-200"
                        }`}
                      >
                        +{formatNaira(optFee)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case "textarea":
        return (
          <div key={index} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.name}
              {field.required ? " *" : ""}
            </label>
            <textarea
              required={field.required}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              rows={4}
              className={inputClass}
            />
          </div>
        );

      case "image":
        return (
          <div key={index} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.name}
              {field.required ? " *" : ""}
            </label>
            <input
              type="file"
              accept="image/*"
              required={field.required && !form[field.name]}
              onChange={(e) => handleFileChange(field.name, e.target.files[0])}
              className={inputClass}
            />
            {isUploading && (
              <p className="text-blue-600 text-sm flex items-center gap-2">
                <i className="fas fa-spinner fa-spin"></i> Uploading image...
              </p>
            )}
            {uploadError && (
              <p className="text-red-500 text-sm">{uploadError}</p>
            )}
            {preview && !isUploading && (
              <img
                src={preview}
                alt={field.name}
                className="w-full max-h-48 object-contain rounded-xl border border-gray-200"
              />
            )}
            {form[field.name] && !isUploading && (
              <p className="text-green-600 text-sm flex items-center gap-1">
                <i className="fas fa-check-circle"></i> Image uploaded
              </p>
            )}
          </div>
        );

      case "file":
        return (
          <div key={index} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.name}
              {field.required ? " *" : ""}
            </label>
            <input
              type="file"
              required={field.required && !form[field.name]}
              onChange={(e) => handleFileChange(field.name, e.target.files[0])}
              className={inputClass}
            />
            {isUploading && (
              <p className="text-blue-600 text-sm flex items-center gap-2">
                <i className="fas fa-spinner fa-spin"></i> Uploading file...
              </p>
            )}
            {uploadError && (
              <p className="text-red-500 text-sm">{uploadError}</p>
            )}
            {preview && !isUploading && (
              <p className="text-gray-600 text-sm flex items-center gap-2">
                <i className="fas fa-file"></i>
                <span className="truncate max-w-xs">{preview}</span>
              </p>
            )}
            {form[field.name] && !isUploading && (
              <p className="text-green-600 text-sm flex items-center gap-1">
                <i className="fas fa-check-circle"></i> File uploaded
              </p>
            )}
          </div>
        );

      case "number":
        return (
          <div key={index} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.name}
              {field.required ? " *" : ""}
            </label>
            <input
              type="number"
              required={field.required}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              className={inputClass}
            />
          </div>
        );

      case "email":
        return (
          <div key={index} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.name}
              {field.required ? " *" : ""}
            </label>
            <input
              type="email"
              required={field.required}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              className={inputClass}
            />
          </div>
        );

      default:
        return (
          <div key={index} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.name}
              {field.required ? " *" : ""}
            </label>
            <input
              type="text"
              required={field.required}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              className={inputClass}
            />
          </div>
        );
    }
  };

  // Any field type (text, email, file, image, etc.) can carry a fee via field.hasFee.
  // When it does, the customer picks yes/no first; the underlying control (whatever
  // type it is) only renders once they say "yes", and is force-required at that point.
  const renderField = (field, index) => {
    if (!field.hasFee) {
      return renderFieldControl(field, index);
    }

    const hasIt = conditionalAnswers[field.name] === true;
    const saidNo = conditionalAnswers[field.name] === false;

    return (
      <div
        key={index}
        className="space-y-3 border border-gray-100 rounded-xl p-4 bg-gray-50/50"
      >
        <label className="block text-sm font-medium text-gray-700">
          Do you already have your {field.name}?
          {field.extraPrice ? (
            <span className="text-xs text-gray-400 font-normal ml-1">
              (+{formatNaira(Number(field.extraPrice))} if not)
            </span>
          ) : null}
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setConditionalAnswers((prev) => ({
                ...prev,
                [field.name]: true,
              }));
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              hasIt
                ? "bg-[#4169E1] text-white border-[#4169E1]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#4169E1]/50"
            }`}
          >
            Yes, I have it
          </button>
          <button
            type="button"
            onClick={() => {
              setConditionalAnswers((prev) => ({
                ...prev,
                [field.name]: false,
              }));
              setForm((prev) => ({ ...prev, [field.name]: "" }));
              setFilePreviews((prev) => ({ ...prev, [field.name]: null }));
              setUploadErrors((prev) => ({ ...prev, [field.name]: null }));
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              saidNo
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            No, I don't have it
          </button>
        </div>
        {hasIt && renderFieldControl({ ...field, required: true }, index)}
      </div>
    );
  };

  const anyUploading = Object.values(uploading).some(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden py-24">
      <AlertModal
        isOpen={alertState.open}
        onClose={closeAlert}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
      />
      {/* WhatsApp number modal */}
      {showWaModal && (
        <WhatsAppModal onConfirm={handleWaConfirm} onClose={handleWaSkip} />
      )}
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <img src={AceLogo} alt="Ace Educational Consult" className="h-16" />
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <button
            onClick={() => navigate("/")}
            className="text-[#4169E1] hover:text-[#3658c9] mb-6 flex items-center gap-2 font-medium"
          >
            <i className="fas fa-arrow-left"></i> Back to Services
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Order
          </h1>
          <p className="text-gray-600 mb-4">
            Service:{" "}
            <span className="font-semibold text-[#4169E1]">{service.name}</span>
          </p>

          {/* Pricing Box with snapshot breakdown */}
          <div className="mb-8 p-4 bg-blue-50/40 rounded-2xl border border-blue-100">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-gray-600">
                Total Amount:
              </span>
              <p className="text-3xl font-extrabold text-[#4169E1]">
                {formatNaira(totalValue)}
              </p>
            </div>
            {priceBreakdown.length > 1 && (
              <div className="mt-3 pt-3 border-t border-blue-200/50 space-y-1.5 text-xs">
                {priceBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-gray-600"
                  >
                    <span>{item.label}</span>
                    <span className="font-semibold text-gray-800">
                      {formatNaira(item.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {service.fields?.map((field, index) => renderField(field, index))}
            <button
              type="submit"
              disabled={anyUploading}
              className="w-full bg-[#4169E1] hover:bg-[#3658c9] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            >
              {anyUploading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Uploading files...
                </>
              ) : (
                "Continue to Payment"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
