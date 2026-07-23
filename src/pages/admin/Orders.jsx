import { useAdmin } from '../../contexts/AdminContext';

export default function OrdersManager() {
  const { orders, services, updateOrderStatus, loading } = useAdmin();

  // Find service details for an order
  const getServiceForOrder = (order) => {
    if (!order.service_id) return null;
    let foundService = null;
    Object.values(services).flat().forEach(service => {
      if (service.id === order.service_id) {
        foundService = service;
      }
    });
    return foundService;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-5xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Orders Manager</h2>
      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center text-gray-500">
          <i className="fas fa-shopping-cart text-5xl mb-4"></i>
          <p>No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.slice().reverse().map(order => {
            const service = getServiceForOrder(order);
            return (
              <div key={order.id} className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="font-bold text-lg text-gray-900">Order #{order.order_id}</p>
                    <p className="text-gray-600">Service: {service?.name || order.service?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">Placed: {new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-4">Customer Details</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {service?.fields?.map((field, index) => (
                      <div key={index}>
                        <span className="font-medium text-gray-900">{field.name}:</span>
                        <span className="ml-2 text-gray-700">
                          {order.user_data?.[field.name] || 'N/A'}
                        </span>
                      </div>
                    ))}
                    {/* Fallback: if we don't have service fields, just show all user data keys */}
                    {!service?.fields?.length &&
                      Object.entries(order.user_data || {}).map(([key, value], index) => (
                        <div key={index}>
                          <span className="font-medium text-gray-900">{key}:</span>
                          <span className="ml-2 text-gray-700">{value}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
