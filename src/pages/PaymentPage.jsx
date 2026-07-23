import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import AceLogo from '../assets/Ace-Educational-Consult-Logo.png';

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { siteSettings, loading } = useAdmin();

  const { orderId, service, formData } = location.state || {};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-5xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!orderId || !service || !formData) {
    navigate('/');
    return null;
  }

  // Handle case where siteSettings might be null initially
  const defaultSettings = {
    whatsappNumber: '',
    paymentDetails: { bankName: '', accountNumber: '', accountName: '' }
  };
  const settings = siteSettings || defaultSettings;

  // WhatsApp prefilled message
  const whatsappMessage = encodeURIComponent(
    `Hello Ace Educational Consult!\n\nI've made a payment for my order.\n\nOrder ID: ${orderId}\nService: ${service.name}\nName: ${formData.fullName}\nPhone: ${formData.phone}\nEmail: ${formData.email}\n\nPlease confirm my payment. Thank you!`
  );
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden py-24">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <img src={AceLogo} alt="Ace Educational Consult" className="h-16" />
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <button onClick={() => navigate('/')} className="text-[#4169E1] hover:text-[#3658c9] mb-6 flex items-center gap-2 font-medium">
            <i className="fas fa-arrow-left"></i> Back to Home
          </button>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4169E1]/10 rounded-full text-[#4169E1] text-3xl mb-4">
              <i className="fas fa-credit-card"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Payment</h1>
            <p className="text-gray-600">Order ID: <span className="font-semibold text-[#FFC107]">{orderId}</span></p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Service Details</h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Service</span>
              <span className="font-semibold">{service.name}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Price</span>
              <span className="font-bold text-[#4169E1] text-xl">{service.price}</span>
            </div>
          </div>
          <div className="border border-[#4169E1]/20 bg-[#4169E1]/5 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i className="fas fa-university text-[#4169E1]"></i> Payment Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Bank Name</span>
                <span className="font-semibold text-gray-900">{settings.paymentDetails.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Number</span>
                <span className="font-semibold text-gray-900">{settings.paymentDetails.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Name</span>
                <span className="font-semibold text-gray-900">{settings.paymentDetails.accountName}</span>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-600 mb-6">Please transfer the exact amount to the account above, then click the button below to notify us.</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex justify-center items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-xl hover:scale-105"
          >
            <i className="fab fa-whatsapp text-2xl"></i>
            I've Made Payment - Notify Us
          </a>
        </div>
      </div>
    </div>
  );
}
