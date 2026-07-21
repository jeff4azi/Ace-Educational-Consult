import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import AceLogo from '../../assets/Ace-Educational-Consult-Logo.png';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoggedIn, logout } = useAdmin();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate('/admin/login');
    return null;
  }

  const navItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: 'fa-home' },
    { path: '/admin/settings', name: 'Site Settings', icon: 'fa-cog' },
    { path: '/admin/services', name: 'Services Manager', icon: 'fa-briefcase' },
    { path: '/admin/messages', name: 'Contact Messages', icon: 'fa-envelope' },
    { path: '/admin/testimonials', name: 'Testimonials', icon: 'fa-star' },
    { path: '/admin/orders', name: 'Orders', icon: 'fa-shopping-cart' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <img src={AceLogo} alt="Ace Educational Consult" className="h-10" />
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`fas ${item.icon}`}></i>
              <span>{item.name}</span>
            </Link>
          ))}
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-900/50 transition-colors w-full text-left"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-700 text-xl">
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <Link to="/" className="text-[#4169E1] hover:text-[#3658c9] font-medium">
            View Site
          </Link>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
