import { useAdmin } from "../../contexts/AdminContext";

export default function DashboardHome() {
  const { services, testimonials, contactMessages, orderSummary } = useAdmin();

  const totalServices = Object.values(services).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );
  const pendingTestimonials = testimonials.filter((t) => !t.approved).length;
  const unreadMessages = contactMessages.filter((m) => !m.read).length;

  const { counts, recent } = orderSummary;

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
      label: "Needs Verification",
      value: counts.pending_verification,
      icon: "fa-file-invoice",
      color: "bg-purple-500",
    },
    {
      label: "Pending Orders",
      value: counts.pending,
      icon: "fa-hourglass-half",
      color: "bg-orange-500",
    },
    {
      label: "Processing Orders",
      value: counts.processing,
      icon: "fa-spinner",
      color: "bg-blue-400",
    },
    {
      label: "Completed Orders",
      value: counts.completed,
      icon: "fa-circle-check",
      color: "bg-green-500",
    },
    {
      label: "Cancelled Orders",
      value: counts.cancelled,
      icon: "fa-circle-xmark",
      color: "bg-red-400",
    },
    {
      label: "Total Orders",
      value: counts.total,
      icon: "fa-shopping-cart",
      color: "bg-indigo-500",
    },
  ];

  const statusConfig = {
    pending_verification: {
      label: "Needs Verification",
      badge: "bg-purple-100 text-purple-800",
    },
    pending: { label: "Pending", badge: "bg-orange-100 text-orange-800" },
    processing: { label: "Processing", badge: "bg-blue-100 text-blue-800" },
    completed: { label: "Completed", badge: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelled", badge: "bg-red-100 text-red-800" },
  };

  const OrderList = ({ title, orderList, emptyText }) => (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg min-w-0">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      {orderList.length === 0 ? (
        <p className="text-gray-500 text-sm">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {orderList.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl gap-2"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-700 truncate font-medium">
                  {order.service?.name || "Unknown service"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {order.order_id}
                </p>
              </div>
              <span
                className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${statusConfig[order.status]?.badge || "bg-gray-100 text-gray-800"}`}
              >
                {statusConfig[order.status]?.label || order.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-w-0 overflow-x-hidden">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Dashboard Overview
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-3 md:p-6 rounded-2xl shadow-lg min-w-0"
          >
            <div className="flex items-center gap-2 md:gap-4">
              <div
                className={`w-9 h-9 md:w-12 md:h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-sm md:text-xl shrink-0`}
              >
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <div className="min-w-0">
                <p className="text-gray-500 text-xs md:text-sm truncate">
                  {stat.label}
                </p>
                <p className="text-xl md:text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Needs Verification — highlighted at the top */}
      <div className="mb-6">
        <OrderList
          title="🔍 Needs Verification"
          orderList={recent.pending_verification ?? []}
          emptyText="No orders awaiting verification"
        />
      </div>

      {/* Other Order Status Panels */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <OrderList
          title="Pending Orders"
          orderList={recent.pending}
          emptyText="No pending orders"
        />
        <OrderList
          title="Processing Orders"
          orderList={recent.processing}
          emptyText="No orders currently processing"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <OrderList
          title="Completed Orders"
          orderList={recent.completed}
          emptyText="No completed orders yet"
        />
        <OrderList
          title="Cancelled Orders"
          orderList={recent.cancelled}
          emptyText="No cancelled orders"
        />
      </div>

      {/* Recent Messages */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg min-w-0">
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
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl gap-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">
                    {msg.name || msg.fullName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {msg.message}
                  </p>
                </div>
                {!msg.read && (
                  <div className="w-3 h-3 bg-red-500 rounded-full shrink-0"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
