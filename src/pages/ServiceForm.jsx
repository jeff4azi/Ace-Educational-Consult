import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrder } from '../contexts/OrderContext';
import AceLogo from '../assets/Ace-Educational-Consult-Logo.png';

export default function ServiceForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSelectedService, setFormData, setOrderId, generateOrderId } = useOrder();
  const [form, setForm] = useState({
    fullName: '',
    age: '',
    email: '',
    phone: '',
    address: '',
    image: null,
    additionalInfo: '',
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOrderId = generateOrderId();
    setSelectedService(location.state?.service);
    setFormData(form);
    setOrderId(newOrderId);
    navigate('/payment');
  };

  if (!location.state?.service) {
    navigate('/');
    return null;
  }

  const { service } = location.state;

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
          <p className="text-gray-600 mb-8">Service: <span className="font-semibold text-[#4169E1]">{service.name}</span></p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
                placeholder="Enter your full name"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                <input
                  type="number"
                  required
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
                  placeholder="Your age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
                  placeholder="+234..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
                rows={3}
                placeholder="Your address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-64 object-contain rounded-xl border border-gray-200"
                  />
                  <p className="text-sm text-gray-600 mt-2">{form.image?.name}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
              <textarea
                value={form.additionalInfo}
                onChange={(e) => setForm({ ...form, additionalInfo: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
                rows={4}
                placeholder="Any extra details we should know"
              />
            </div>
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
