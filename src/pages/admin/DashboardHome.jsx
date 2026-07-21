import { useAdmin } from '../../contexts/AdminContext';

export default function DashboardHome() {
  const { services, testimonials, contactMessages, orders } = useAdmin();
  
  const totalServices = Object.values(services).reduce((sum, arr) => sum + arr.length, 0);
  const pendingTestimonials = testimonials.filter(t => !t.approved).length;
  const unreadMessages = contactMessages.filter(m => !m.read).length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const stats = [
    { label: 'Total Services', value: totalServices, icon: 'fa-briefcase', color: 'bg-blue-500' },
    { label: 'Pending Testimonials', value: pendingTestimonials, icon: 'fa-star', color: 'bg-yellow-500' },
    { label: 'Unread Messages', value: unreadMessages, icon: 'fa-envelope', color: 'bg-red-500' },
    { label: 'Pending Orders', value: pendingOrders, icon: 'fa-shopping-cart', color: 'bg-green-500' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
          {orders.slice(-5).reverse().length === 0 ? (
            <p className="text-gray-500">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(-5).reverse().map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">{order.formData?.fullName || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{order.service?.name || 'N/A'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Messages</h3>
          {contactMessages.slice(-5).reverse().length === 0 ? (
            <p className="text-gray-500">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {contactMessages.slice(-5).reverse().map(msg => (
                <div key={msg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">{msg.fullName}</p>
                    <p className="text-sm text-gray-500 truncate max-w-[200px]">{msg.message}</p>
                  </div>
                  {!msg.read && <div className="w-3 h-3 bg-red-500 rounded-full"></div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
