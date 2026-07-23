import { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

const initialSiteSettings = {
  phoneNumber: '+234 800 000 0000',
  email: 'contact@aceeducational.com',
  address: 'Lagos, Nigeria',
  businessHours: 'Monday - Saturday: 8:00 AM - 8:00 PM',
  whatsappNumber: '2348000000000',
  socialLinks: {
    facebook: '#',
    twitter: '#',
    instagram: '#',
    linkedin: '#'
  },
  paymentDetails: {
    bankName: 'Zenith Bank',
    accountNumber: '1234567890',
    accountName: 'Ace Educational Consult'
  }
};

const initialServices = {
  "Examination Services": [
    { id: 1, name: "WAEC GCE Registration", price: "₦38,500", description: "Register for WAEC GCE with ease and confidence.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=WAEC%20examination%20registration%20form%20and%20certificate%20in%20Nigeria%20professional%20education&image_size=square_hd", fields: [] },
    { id: 2, name: "WAEC Result Checker", price: "₦5,350", description: "Quickly check your WAEC results online.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=WAEC%20result%20checking%20online%20portal%20screen%20education&image_size=square_hd", fields: [] },
    { id: 3, name: "WAEC Verification", price: "₦5,500", description: "Verify your WAEC certificate authenticity.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=certificate%20verification%20stamp%20and%20document%20education&image_size=square_hd", fields: [] },
    { id: 4, name: "NECO Result Checker", price: "₦2,300", description: "Check your NECO results instantly.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=NECO%20examination%20result%20sheet%20education&image_size=square_hd", fields: [] },
    { id: 5, name: "NECO e-Verification Token", price: "₦6,000", description: "Get your NECO e-verification token.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=digital%20token%20and%20security%20code%20education&image_size=square_hd", fields: [] },
    { id: 6, name: "NECO e-Verification PDF", price: "₦5,800", description: "Download NECO verification PDF.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=PDF%20document%20download%20education&image_size=square_hd", fields: [] },
    { id: 7, name: "NABTEB GCE Registration", price: "₦25,000", description: "Register for NABTEB GCE.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=NABTEB%20registration%20form%20education&image_size=square_hd", fields: [] },
    { id: 8, name: "NABTEB Result Checker", price: "₦900", description: "Check NABTEB results quickly.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=result%20checker%20interface%20education&image_size=square_hd", fields: [] },
    { id: 9, name: "NBAIS Result Checker", price: "₦1,300", description: "Check NBAIS results online.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=examination%20result%20display%20education&image_size=square_hd", fields: [] }
  ],
  "JAMB Services": [
    { id: 10, name: "Admission Letter Printing", price: "Contact for Price", description: "Print your JAMB admission letter.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=university%20admission%20letter%20education&image_size=square_hd", fields: [] },
    { id: 11, name: "Original Result Printing", price: "Contact for Price", description: "Get your original JAMB result printed.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=JAMB%20result%20slip%20education&image_size=square_hd", fields: [] },
    { id: 12, name: "Change of Course Processing", price: "Contact for Price", description: "Process your JAMB change of course.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=course%20change%20form%20education&image_size=square_hd", fields: [] },
    { id: 13, name: "Reprinting Services", price: "Contact for Price", description: "JAMB reprinting services available.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=printer%20printing%20document%20education&image_size=square_hd", fields: [] },
    { id: 14, name: "O'Level Upload Support", price: "Contact for Price", description: "Upload your O'Level results to JAMB.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=upload%20document%20to%20portal%20education&image_size=square_hd", fields: [] },
    { id: 15, name: "CAPS Admission Processing", price: "Contact for Price", description: "JAMB CAPS admission assistance.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=university%20admission%20portal%20education&image_size=square_hd", fields: [] }
  ],
  "Identity & Verification": [
    { id: 16, name: "NIN Services", price: "Contact for Price", description: "National Identity Number services.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Nigerian%20NIN%20identity%20card%20verification&image_size=square_hd", fields: [] },
    { id: 17, name: "Lost NIN Retrieval", price: "₦500", description: "Retrieve your lost NIN quickly.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=lost%20id%20card%20retrieval%20service&image_size=square_hd", fields: [] },
    { id: 18, name: "BVN Services", price: "Contact for Price", description: "Bank Verification Number services.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=bank%20verification%20number%20BVN%20card&image_size=square_hd", fields: [] }
  ],
  "Digital & Utility Services": [
    { id: 19, name: "Airtime Recharge", price: "Contact for Price", description: "Recharge your mobile airtime.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mobile%20phone%20airtime%20recharge&image_size=square_hd", fields: [] },
    { id: 20, name: "Data Subscription", price: "Contact for Price", description: "Subscribe to mobile data plans.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mobile%20data%20subscription%20smartphone&image_size=square_hd", fields: [] },
    { id: 21, name: "Electricity Bill Payment", price: "Contact for Price", description: "Pay your electricity bills online.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=electricity%20bill%20payment%20meter&image_size=square_hd", fields: [] },
    { id: 22, name: "TV Subscription", price: "Contact for Price", description: "Renew your TV subscription.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=television%20subscription%20remote%20control&image_size=square_hd", fields: [] },
    { id: 23, name: "PIN Vending", price: "Contact for Price", description: "Purchase various PINs.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=digital%20pin%20code%20security&image_size=square_hd", fields: [] },
    { id: 24, name: "Digital Coupons", price: "Contact for Price", description: "Get digital coupons and vouchers.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=digital%20coupon%20voucher%20discount&image_size=square_hd", fields: [] }
  ],
  "University Services": [],
  "Other Services": [],
};

const initialTestimonials = [
  { id: 1, name: "Happy Client", text: "Very reliable and fast service. I received my result verification the same day.", rating: 5, approved: true, createdAt: new Date().toISOString() },
  { id: 2, name: "Happy Client", text: "Excellent customer support and affordable pricing.", rating: 5, approved: true, createdAt: new Date().toISOString() },
  { id: 3, name: "Happy Client", text: "Highly recommended for JAMB and WAEC services.", rating: 5, approved: true, createdAt: new Date().toISOString() }
];

const initialContactMessages = [];
const initialOrders = [];

export function AdminProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('adminLoggedIn') === 'true';
  });
  const [siteSettings, setSiteSettings] = useState(() => {
    const saved = localStorage.getItem('siteSettings');
    return saved ? JSON.parse(saved) : initialSiteSettings;
  });
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('services');
    if (saved) {
      const savedServices = JSON.parse(saved);
      // Ensure new categories exist
      const mergedServices = {
        ...initialServices,
        ...savedServices
      };
      return mergedServices;
    }
    return initialServices;
  });
  const [testimonials, setTestimonials] = useState(() => {
    const saved = localStorage.getItem('testimonials');
    return saved ? JSON.parse(saved) : initialTestimonials;
  });
  const [contactMessages, setContactMessages] = useState(() => {
    const saved = localStorage.getItem('contactMessages');
    return saved ? JSON.parse(saved) : initialContactMessages;
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  useEffect(() => {
    localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('contactMessages', JSON.stringify(contactMessages));
  }, [contactMessages]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const login = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      localStorage.setItem('adminLoggedIn', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminLoggedIn');
  };

  const updateSiteSettings = (newSettings) => {
    setSiteSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addService = (category, service) => {
    const newService = { ...service, id: Date.now(), fields: service.fields || [] };
    setServices(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), newService]
    }));
  };

  const updateService = (category, serviceId, updatedService) => {
    setServices(prev => ({
      ...prev,
      [category]: prev[category].map(s => s.id === serviceId ? { ...s, ...updatedService } : s)
    }));
  };

  const deleteService = (category, serviceId) => {
    setServices(prev => ({
      ...prev,
      [category]: prev[category].filter(s => s.id !== serviceId)
    }));
  };

  const addTestimonial = (testimonial) => {
    const newTestimonial = { ...testimonial, id: Date.now(), approved: false, createdAt: new Date().toISOString() };
    setTestimonials(prev => [...prev, newTestimonial]);
  };

  const approveTestimonial = (id) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, approved: true } : t));
  };

  const deleteTestimonial = (id) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const addContactMessage = (message) => {
    const newMessage = { ...message, id: Date.now(), read: false, createdAt: new Date().toISOString() };
    setContactMessages(prev => [...prev, newMessage]);
  };

  const markMessageRead = (id) => {
    setContactMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const deleteMessage = (id) => {
    setContactMessages(prev => prev.filter(m => m.id !== id));
  };

  const addOrder = (order) => {
    const newOrder = { ...order, id: Date.now(), status: 'pending', createdAt: new Date().toISOString() };
    setOrders(prev => [...prev, newOrder]);
  };

  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <AdminContext.Provider
      value={{
        isLoggedIn,
        siteSettings,
        services,
        testimonials,
        contactMessages,
        orders,
        login,
        logout,
        updateSiteSettings,
        addService,
        updateService,
        deleteService,
        setServices,
        addTestimonial,
        approveTestimonial,
        deleteTestimonial,
        addContactMessage,
        markMessageRead,
        deleteMessage,
        addOrder,
        updateOrderStatus
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
