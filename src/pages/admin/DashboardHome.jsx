import { useAdmin } from "../../contexts/AdminContext";

export default function DashboardHome() {
  const { services, testimonials, contactMessages, orders } = useAdmin();

  const totalServices = Object.values(services).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );
  const pendingTestimonials = testimonials.filter((t) => !t.approved).length;
  const unreadMessages = contactMessages.filter((m) => !m.read).length;

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const processingOrders = orders.filter((o) => o.status === "processing");
  const completedOrders = orders.filter((o) => o.status === "completed");
  const cancelledOrders = orders.filter((o) => o.status === "cancelled");

  const stats = [
    {
      label: "Total Services",
      value: totalServices,
      icon: "fa-briefcase",
      color: "bg-blue-500",
    },
    {
      label: "Pending Testimonials",
      value: pendingTestimonials,
      icon: "fa-star",
      color: "bg-yellow-500",
    },
    {
      label: "Unread Messages",
      value: unreadMessages,
      icon: "fa-envelope",
      color: "bg-red-500",
    },
    {
      label: "Pending Orders",
      value: pendingOrders.length,
      icon: "fa-hourglass-half",
      color: "bg-orange-500",
    },
    {
      label: "Processing Orders",
      value: processingOrders.length,
      icon: "fa-spinner",
      color: "bg-blue-400",
    },
    {
      label: "Completed Orders",
      value: completedOrders.length,
      icon: "fa-circle-check",
      color: "bg-green-500",
    },
    {
      label: "Cancelled Orders",
      value: cancelledOrders.length,
      icon: "fa-circle-xmark",
      color: "bg-red-400",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: "fa-shopping-cart",
      color: "bg-indigo-500",
    },
  ];

  const statusConfig = {
    pending: { label: "Pending", badge: "bg-orange-100 text-orange-800" },
    processing: { label: "Processing", badge: "bg-blue-100 text-blue-800" },
    completed: { label: "Completed", badge: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelled", badge: "bg-red-100 text-red-800" },
  };

  const OrderList = ({ title, orderList, emptyText }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      {orderList.length === 0 ? (
        <p className="text-gray-500 text-sm">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {orderList.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">
                  {order.user_data?.fullName || order.user_data?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {order.service?.name || "N/A"}
                </p>
                <p className="text-xs text-gray-400">{order.order_id}</p>
              </div>
              <span
                className={`ml-3 shrink-0 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[order.status]?.badge || "bg-gray-100 text-gray-800"}`}
              >
                {statusConfig[order.status]?.label || order.status}
              </span>
            </div>
          ))}
          {orderList.length > 5 && (
            <p className="text-xs text-gray-400 text-center pt-1">
              +{orderList.length - 5} more — view in Orders
            </p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Dashboard Overview
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-xl shrink-0`}
              >
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

      {/* Order Status Panels */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <OrderList
          title="Pending Orders"
          orderList={pendingOrders}
          emptyText="No pending orders"
        />
        <OrderList
          title="Processing Orders"
          orderList={processingOrders}
          emptyText="No orders currently processing"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <OrderList
          title="Completed Orders"
          orderList={completedOrders}
          emptyText="No completed orders yet"
        />
        <OrderList
          title="Cancelled Orders"
          orderList={cancelledOrders}
          emptyText="No cancelled orders"
        />
      </div>

      {/* Recent Messages */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Recent Messages
        </h3>
        {contactMessages.length === 0 ? (
          <p className="text-gray-500">No messages yet</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {contactMessages.slice(0, 6).map((msg) => (
              <div
                key={msg.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">
                    {msg.name || msg.fullName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {msg.message}
                  </p>
                </div>
                {!msg.read && (
                  <div className="w-3 h-3 bg-red-500 rounded-full shrink-0 ml-3"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
