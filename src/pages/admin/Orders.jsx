import { useAdmin } from '../../contexts/AdminContext';

export default function OrdersManager() {
  const { orders, updateOrderStatus } = useAdmin();

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
          {orders.slice().reverse().map(order => (
            <div key={order.id} className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="font-bold text-lg text-gray-900">Order #{order.orderId}</p>
                  <p className="text-gray-600">Service: {order.service?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-500">Placed: {new Date(order.createdAt).toLocaleString()}</p>
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
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Customer Details</h4>
                  <p className="text-gray-700"><span className="font-medium">Name:</span> {order.formData?.fullName}</p>
                  <p className="text-gray-700"><span className="font-medium">Email:</span> {order.formData?.email}</p>
                  <p className="text-gray-700"><span className="font-medium">Phone:</span> {order.formData?.phone}</p>
                </div>
                {order.formData?.additionalInfo && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2">Additional Info</h4>
                    <p className="text-gray-700">{order.formData.additionalInfo}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
