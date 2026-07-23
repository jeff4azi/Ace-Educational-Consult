import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState(null);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [services, setServices] = useState({}); // { [categoryId]: [...services] }
  const [testimonials, setTestimonials] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [orders, setOrders] = useState([]);

  // Check session and load data on mount
  useEffect(() => {
    const init = async () => {
      try {
        // First check auth session
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        // Then load public data
        await Promise.all([
          loadSiteSettings(),
          loadServiceCategories(),
          loadServices(),
          loadTestimonials(),
        ]);

        // If user is logged in, load admin-only data
        if (session?.user) {
          await Promise.all([
            loadContactMessages(),
            loadOrders(),
          ]);
        }
      } catch (error) {
        console.error('Error initializing:', error);
      } finally {
        // Set loading to false regardless of success/failure
        setLoading(false);
      }
    };

    init();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load admin-only data when user logs in
  useEffect(() => {
    const loadAdminData = async () => {
      if (user) {
        try {
          await Promise.all([
            loadContactMessages(),
            loadOrders(),
          ]);
        } catch (error) {
          console.error('Error loading admin data:', error);
        }
      }
    };
    loadAdminData();
  }, [user]);

  // Load site settings
  const loadSiteSettings = async () => {
    const { data, error } = await supabase.from('site_settings').select('*').single();
    if (!error && data) {
      setSiteSettings({
        phoneNumber: data.phone_number,
        email: data.email,
        address: data.address,
        businessHours: data.business_hours,
        whatsappNumber: data.whatsapp_number,
        socialLinks: data.social_links,
        paymentDetails: data.payment_details,
      });
    }
  };

  // Load service categories
  const loadServiceCategories = async () => {
    const { data, error } = await supabase.from('service_categories').select('*').order('name');
    if (!error && data) {
      setServiceCategories(data);
    }
  };

  // Load services
  const loadServices = async () => {
    const { data, error } = await supabase.from('services').select('*, category: service_categories(name)');
    if (!error && data) {
      // Group services by category
      const groupedServices = {};
      data.forEach(service => {
        const categoryName = service.category?.name;
        if (categoryName) {
          if (!groupedServices[categoryName]) {
            groupedServices[categoryName] = [];
          }
          groupedServices[categoryName].push({
            id: service.id,
            name: service.name,
            price: service.price,
            description: service.description,
            image: service.image_url,
            fields: service.fields || [],
          });
        }
      });
      setServices(groupedServices);
    }
  };

  // Load testimonials
  const loadTestimonials = async () => {
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setTestimonials(data);
    }
  };

  // Load contact messages
  const loadContactMessages = async () => {
    const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setContactMessages(data);
    }
  };

  // Load orders
  const loadOrders = async () => {
    const { data, error } = await supabase.from('orders').select('*, service: services(name)').order('created_at', { ascending: false });
    if (!error && data) {
      setOrders(data);
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // Site settings
  const updateSiteSettings = async (newSettings) => {
    const updatedSettings = {
      phone_number: newSettings.phoneNumber,
      email: newSettings.email,
      address: newSettings.address,
      business_hours: newSettings.businessHours,
      whatsapp_number: newSettings.whatsappNumber,
      social_links: newSettings.socialLinks,
      payment_details: newSettings.paymentDetails,
    };
    const { data, error } = await supabase.from('site_settings').select('id').single();
    if (error) {
      console.error('Error fetching site settings:', error);
      return;
    }
    if (data) {
      await supabase.from('site_settings').update(updatedSettings).eq('id', data.id);
    } else {
      await supabase.from('site_settings').insert(updatedSettings);
    }
    setSiteSettings(newSettings);
  };

  // Service categories
  const addServiceCategory = async (categoryName) => {
    const { data, error } = await supabase.from('service_categories').insert({ name: categoryName }).select().single();
    if (!error && data) {
      setServiceCategories(prev => [...prev, data]);
      setServices(prev => ({ ...prev, [categoryName]: [] }));
    }
  };

  // Services
  const addService = async (categoryName, service) => {
    // Get category id
    const category = serviceCategories.find(cat => cat.name === categoryName);
    if (!category) return;

    const { data, error } = await supabase.from('services').insert({
      category_id: category.id,
      name: service.name,
      price: service.price,
      description: service.description,
      image_url: service.image,
      fields: service.fields || [],
    }).select().single();

    if (!error && data) {
      const newService = {
        id: data.id,
        name: data.name,
        price: data.price,
        description: data.description,
        image: data.image_url,
        fields: data.fields || [],
      };
      setServices(prev => ({
        ...prev,
        [categoryName]: [...(prev[categoryName] || []), newService]
      }));
    }
  };

  const updateService = async (categoryName, serviceId, updatedService) => {
    const category = serviceCategories.find(cat => cat.name === categoryName);
    if (!category) return;

    const { data, error } = await supabase.from('services').update({
      category_id: category.id,
      name: updatedService.name,
      price: updatedService.price,
      description: updatedService.description,
      image_url: updatedService.image,
      fields: updatedService.fields || [],
    }).eq('id', serviceId).select();

    if (error) {
      console.error('Error updating service:', error);
    } else {
      // Reload all services to ensure grouping is correct if category changed
      await loadServices();
    }
  };

  const deleteService = async (categoryName, serviceId) => {
    await supabase.from('services').delete().eq('id', serviceId);
    setServices(prev => ({
      ...prev,
      [categoryName]: prev[categoryName].filter(s => s.id !== serviceId)
    }));
  };

  // Testimonials
  const addTestimonial = async (testimonial) => {
    const { data, error } = await supabase.from('testimonials').insert({
      name: testimonial.name,
      text: testimonial.text,
      rating: testimonial.rating,
    }).select().single();

    if (!error && data) {
      setTestimonials(prev => [data, ...prev]);
    }
  };

  const approveTestimonial = async (id) => {
    await supabase.from('testimonials').update({ approved: true }).eq('id', id);
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, approved: true } : t));
  };

  const deleteTestimonial = async (id) => {
    await supabase.from('testimonials').delete().eq('id', id);
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  // Contact messages
  const addContactMessage = async (message) => {
    const { data, error } = await supabase.from('contact_messages').insert({
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
    }).select().single();

    if (!error && data) {
      setContactMessages(prev => [data, ...prev]);
    }
  };

  const markMessageRead = async (id) => {
    await supabase.from('contact_messages').update({ read: true }).eq('id', id);
    setContactMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const deleteMessage = async (id) => {
    await supabase.from('contact_messages').delete().eq('id', id);
    setContactMessages(prev => prev.filter(m => m.id !== id));
  };

  // Orders
  const addOrder = async (order) => {
    const { data, error } = await supabase.from('orders').insert({
      order_id: order.orderId,
      service_id: order.serviceId, // Use the serviceId passed directly
      user_data: order.formData,
      status: 'pending',
    }).select().single();

    if (!error && data) {
      setOrders(prev => [data, ...prev]);
    }
  };

  const updateOrderStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const deleteOrder = async (id) => {
    await supabase.from('orders').delete().eq('id', id);
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  return (
    <AdminContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        siteSettings,
        serviceCategories,
        services,
        testimonials,
        contactMessages,
        orders,
        loading,
        login,
        logout,
        updateSiteSettings,
        addServiceCategory,
        addService,
        updateService,
        deleteService,
        addTestimonial,
        approveTestimonial,
        deleteTestimonial,
        addContactMessage,
        markMessageRead,
        deleteMessage,
        addOrder,
        updateOrderStatus,
        deleteOrder
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
