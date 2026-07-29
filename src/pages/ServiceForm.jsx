import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdmin } from "../contexts/AdminContext";
import AceLogo from "../assets/Ace-Educational-Consult-Logo.png";
import { uploadOrderFile } from "../lib/imageUpload";

export default function ServiceForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addOrder } = useAdmin();
  const [form, setForm] = useState({});
  const [filePreviews, setFilePreviews] = useState({});
  const [uploading, setUploading] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});

  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ACE-${timestamp}-${random}`;
  };

  const handleFileChange = async (fieldName, file) => {
    if (!file) return;

    // Show a local preview immediately (only for images)
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) =>
        setFilePreviews((prev) => ({ ...prev, [fieldName]: e.target.result }));
      reader.readAsDataURL(file);
    } else {
      // For non-image files show the filename as the "preview"
      setFilePreviews((prev) => ({ ...prev, [fieldName]: file.name }));
    }

    // Clear any previous error for this field
    setUploadErrors((prev) => ({ ...prev, [fieldName]: null }));

    // Mark field as uploading and clear the previous value
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

    // Block submission if any file is still uploading
    if (Object.values(uploading).some(Boolean)) {
      alert("Please wait for all files to finish uploading.");
      return;
    }

    const newOrderId = generateOrderId();
    addOrder({
      orderId: newOrderId,
      serviceId: location.state?.service.id,
      formData: form,
    });

    try {
      const existing = JSON.parse(
        localStorage.getItem("ace_order_ids") || "[]",
      );
      if (!existing.includes(newOrderId)) {
        localStorage.setItem(
          "ace_order_ids",
          JSON.stringify([...existing, newOrderId]),
        );
      }
    } catch {
      localStorage.setItem("ace_order_ids", JSON.stringify([newOrderId]));
    }

    navigate("/payment", {
      state: {
        orderId: newOrderId,
        service: location.state?.service,
        formData: form,
      },
    });
  };

  if (!location.state?.service) {
    navigate("/");
    return null;
  }

  const { service } = location.state;

  const renderField = (field, index) => {
    const value = form[field.name] || "";
    const isUploading = uploading[field.name];
    const uploadError = uploadErrors[field.name];
    const preview = filePreviews[field.name];

    const handleChange = (val) =>
      setForm((prev) => ({ ...prev, [field.name]: val }));

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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
            />
            {isUploading && (
              <div className="flex items-center gap-2 text-blue-600 text-sm">
                <i className="fas fa-spinner fa-spin"></i>
                <span>Uploading image...</span>
              </div>
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
            />
            {isUploading && (
              <div className="flex items-center gap-2 text-blue-600 text-sm">
                <i className="fas fa-spinner fa-spin"></i>
                <span>Uploading file...</span>
              </div>
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
            />
          </div>
        );

      default: // text
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
            />
          </div>
        );
    }
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
          <p className="text-2xl font-bold text-[#4169E1] mb-8">
            {service.price}
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {service.fields?.map((field, index) => renderField(field, index))}
            <button
              type="submit"
              disabled={anyUploading}
              className="w-full bg-[#4169E1] hover:bg-[#3658c9] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            >
              {anyUploading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Uploading files...
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
