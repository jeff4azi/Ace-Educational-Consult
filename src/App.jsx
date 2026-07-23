import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ServiceForm from './pages/ServiceForm';
import PaymentPage from './pages/PaymentPage';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import DashboardHome from './pages/admin/DashboardHome';
import SiteSettings from './pages/admin/Settings';
import ServicesManager from './pages/admin/Services';
import ContactMessages from './pages/admin/Messages';
import TestimonialsManager from './pages/admin/Testimonials';
import OrdersManager from './pages/admin/Orders';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/service-form" element={<ServiceForm />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="settings" element={<SiteSettings />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="messages" element={<ContactMessages />} />
          <Route path="testimonials" element={<TestimonialsManager />} />
          <Route path="orders" element={<OrdersManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
