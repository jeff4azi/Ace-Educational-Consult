import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import AceLogo from "../assets/Ace-Educational-Consult-Logo.png";
import { uploadOrderFile } from "../lib/imageUpload";
import { useAdmin } from "../contexts/AdminContext";

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
  // true = "Yes, I have it" (no fee) | false/undefined = "No" (fee applies)
  const [resolvedService, setResolvedService] = useState(
    location.state?.service || null,
  );
  const [resolving, setResolving] = useState(
    !location.state?.service && !!serviceId,
  );

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
    const image = service.image || `${window.location.origin}/android-chrome-512x512.png`;

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
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:image"]', "property", "og:image", image);
    setMeta('meta[name="twitter:url"]', "name", "twitter:url", url);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.values(uploading).some(Boolean)) {
      alert("Please wait for all files to finish uploading.");
      return;
    }

    const service = resolvedService;

    // Save pending order to localStorage — order is NOT created in DB yet.
    // The order will only be created after the user uploads their payment receipt.
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
      savedAt: Date.now(),
    };

    try {
      localStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(pendingOrder));
    } catch {
      // localStorage might be full — proceed anyway, state will carry the data
    }

    navigate("/payment", { state: { pendingOrder } });
  };

  const conditionalFields = (resolvedService?.fields || []).filter(
    (f) => f.hasFee,
  );
  const extraFees = conditionalFields.reduce((sum, f) => {
    const saidNo = conditionalAnswers[f.name] === false;
    return saidNo ? sum + (Number(f.extraPrice) || 0) : sum;
  }, 0);
  const baseValue = resolvedService ? parsePrice(resolvedService.price) : 0;
  const totalValue = baseValue + extraFees;

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
      <div key={index} className="space-y-3 border border-gray-100 rounded-xl p-4 bg-gray-50/50">
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
              setConditionalAnswers((prev) => ({ ...prev, [field.name]: true }));
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
              setConditionalAnswers((prev) => ({ ...prev, [field.name]: false }));
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
          <p className="text-gray-600 mb-2">
            Service:{" "}
            <span className="font-semibold text-[#4169E1]">{service.name}</span>
          </p>
          <div className="mb-8">
            <p className="text-2xl font-bold text-[#4169E1]">
              {formatNaira(totalValue)}
            </p>
            {extraFees > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                Base {formatNaira(baseValue)} + {formatNaira(extraFees)} for missing
                details you don't currently have
              </p>
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
