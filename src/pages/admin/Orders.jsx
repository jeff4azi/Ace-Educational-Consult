import { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

export default function OrdersManager() {
  const { orders, services, updateOrderStatus, loading } = useAdmin();
  const [searchOrderId, setSearchOrderId] = useState('');

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

  // Download function for data URLs
  const downloadFile = (dataUrl, fileName) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter orders based on search
  const filteredOrders = searchOrderId.trim()
    ? orders.filter(order => order.order_id?.toLowerCase().includes(searchOrderId.toLowerCase()))
    : orders;

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
      
      {/* Search Input */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Search by Order ID</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchOrderId}
            onChange={(e) => setSearchOrderId(e.target.value)}
            placeholder="Paste or type order ID..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
          />
          {searchOrderId && (
            <button
              onClick={() => setSearchOrderId('')}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center text-gray-500">
          <i className="fas fa-shopping-cart text-5xl mb-4"></i>
          <p>{searchOrderId ? 'No order found with that ID' : 'No orders yet'}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.slice().reverse().map(order => {
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
                  <div className="grid md:grid-cols-2 gap-6">
                    {service?.fields?.map((field, index) => {
                      const value = order.user_data?.[field.name];
                      if (!value) {
                        return (
                          <div key={index}>
                            <span className="font-medium text-gray-900">{field.name}:</span>
                            <span className="ml-2 text-gray-500">N/A</span>
                          </div>
                        );
                      }

                      if (field.type === 'image') {
                        return (
                          <div key={index} className="space-y-2">
                            <span className="font-medium text-gray-900 block">{field.name}:</span>
                            <img
                              src={value}
                              alt={field.name}
                              className="w-full max-h-64 object-contain rounded-xl border border-gray-200"
                            />
                            <button
                              onClick={() => downloadFile(value, `${field.name}.png`)}
                              className="bg-[#4169E1] hover:bg-[#3658c9] text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                              <i className="fas fa-download mr-2"></i> Download Image
                            </button>
                          </div>
                        );
                      }

                      if (field.type === 'file') {
                        return (
                          <div key={index} className="space-y-2">
                            <span className="font-medium text-gray-900 block">{field.name}:</span>
                            <button
                              onClick={() => downloadFile(value, `${field.name}.bin`)}
                              className="bg-[#4169E1] hover:bg-[#3658c9] text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                              <i className="fas fa-download mr-2"></i> Download File
                            </button>
                          </div>
                        );
                      }

                      // Regular text field
                      return (
                        <div key={index}>
                          <span className="font-medium text-gray-900">{field.name}:</span>
                          <span className="ml-2 text-gray-700 break-all">{value}</span>
                        </div>
                      );
                    })}
                    {/* Fallback: if we don't have service fields, just show all user data keys */}
                    {!service?.fields?.length &&
                      Object.entries(order.user_data || {}).map(([key, value], index) => {
                        if (typeof value === 'string' && value.startsWith('data:')) {
                          return (
                            <div key={index} className="space-y-2">
                              <span className="font-medium text-gray-900 block">{key}:</span>
                              {value.startsWith('data:image') ? (
                                <>
                                  <img
                                    src={value}
                                    alt={key}
                                    className="w-full max-h-64 object-contain rounded-xl border border-gray-200"
                                  />
                                  <button
                                    onClick={() => downloadFile(value, `${key}.png`)}
                                    className="bg-[#4169E1] hover:bg-[#3658c9] text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                  >
                                    <i className="fas fa-download mr-2"></i> Download
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => downloadFile(value, `${key}.bin`)}
                                  className="bg-[#4169E1] hover:bg-[#3658c9] text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                  <i className="fas fa-download mr-2"></i> Download
                                </button>
                              )}
                            </div>
                          );
                        }
                        return (
                          <div key={index}>
                            <span className="font-medium text-gray-900">{key}:</span>
                            <span className="ml-2 text-gray-700 break-all">{value}</span>
                          </div>
                        );
                      })
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
