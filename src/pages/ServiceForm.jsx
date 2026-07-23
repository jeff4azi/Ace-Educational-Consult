import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import AceLogo from '../assets/Ace-Educational-Consult-Logo.png';

export default function ServiceForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addOrder, siteSettings } = useAdmin();
  const [form, setForm] = useState({});
  const [filePreviews, setFilePreviews] = useState({}); // key: field name, value: data URL
  const [orderId, setOrderId] = useState(null);

  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ACE-${timestamp}-${random}`;
  };

  const handleFileChange = (fieldName, file) => {
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreviews(prev => ({ ...prev, [fieldName]: event.target.result }));
        setForm(prev => ({ ...prev, [fieldName]: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);
    addOrder({
      orderId: newOrderId,
      service: location.state?.service,
      formData: form,
      status: 'pending',
    });
    navigate('/payment', { state: { orderId: newOrderId, service: location.state?.service, formData: form } });
  };

  if (!location.state?.service) {
    navigate('/');
    return null;
  }

  const { service } = location.state;

  const renderField = (field, index) => {
    const value = form[field.name] || '';
    const handleChange = (val) => {
      setForm(prev => ({ ...prev, [field.name]: val }));
    };

    switch (field.type) {
      case 'textarea':
        return (
          <div key={index} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{field.name}{field.required ? ' *' : ''}</label>
            <textarea
              required={field.required}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
            />
          </div>
        );
      case 'file':
        return (
          <div key={index} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{field.name}{field.required ? ' *' : ''}</label>
            <input
              type="file"
              required={field.required}
              onChange={(e) => handleFileChange(field.name, e.target.files[0])}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
            />
          </div>
        );
      case 'image':
        return (
          <div key={index} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{field.name}{field.required ? ' *' : ''}</label>
            <input
              type="file"
              accept="image/*"
              required={field.required}
              onChange={(e) => handleFileChange(field.name, e.target.files[0])}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
            />
            {filePreviews[field.name] && (
              <div className="mt-4">
                <img
                  src={filePreviews[field.name]}
                  alt={field.name}
                  className="w-full max-h-64 object-contain rounded-xl border border-gray-200"
                />
              </div>
            )}
          </div>
        );
      case 'number':
        return (
          <div key={index} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{field.name}{field.required ? ' *' : ''}</label>
            <input
              type="number"
              required={field.required}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
            />
          </div>
        );
      case 'email':
        return (
          <div key={index} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{field.name}{field.required ? ' *' : ''}</label>
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
            <label className="block text-sm font-medium text-gray-700">{field.name}{field.required ? ' *' : ''}</label>
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

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden py-24">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <img src={AceLogo} alt="Ace Educational Consult" className="h-16" />
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <button onClick={() => navigate('/')} className="text-[#4169E1] hover:text-[#3658c9] mb-6 flex items-center gap-2 font-medium">
            <i className="fas fa-arrow-left"></i> Back to Services
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Order</h1>
          <p className="text-gray-600 mb-2">Service: <span className="font-semibold text-[#4169E1]">{service.name}</span></p>
          <p className="text-2xl font-bold text-[#4169E1] mb-8">{service.price}</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {service.fields?.map((field, index) => renderField(field, index))}
            <button
              type="submit"
              className="w-full bg-[#4169E1] hover:bg-[#3658c9] text-white py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-xl hover:scale-105"
            >
              Continue to Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
