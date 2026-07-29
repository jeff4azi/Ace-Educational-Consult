import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "../../contexts/AdminContext";
import { supabase } from "../../lib/supabase";
import ConfirmModal from "../../components/ConfirmModal";

const PAGE_SIZE = 20;

const STATUS_TABS = [
  {
    key: "pending_verification",
    label: "Needs Verification",
    badge: "bg-purple-100 text-purple-800",
    dot: "bg-purple-500",
  },
  {
    key: "pending",
    label: "Pending",
    badge: "bg-orange-100 text-orange-800",
    dot: "bg-orange-400",
  },
  {
    key: "processing",
    label: "Processing",
    badge: "bg-blue-100 text-blue-800",
    dot: "bg-blue-400",
  },
  {
    key: "completed",
    label: "Completed",
    badge: "bg-green-100 text-green-800",
    dot: "bg-green-500",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    badge: "bg-red-100 text-red-800",
    dot: "bg-red-400",
  },
];

export default function OrdersManager() {
  const { services, updateOrderStatus, deleteOrder, refreshOrderSummary } =
    useAdmin();

  const [activeStatus, setActiveStatus] = useState("pending_verification");
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);

  const [searchOrderId, setSearchOrderId] = useState("");
  const [expandedOrders, setExpandedOrders] = useState({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState(null);

  // ─── Fetch ────────────────────────────────────────────────────────────────

  const fetchOrders = useCallback(
    async (status, pageIndex, replace = false) => {
      const from = pageIndex * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      pageIndex === 0 ? setFetching(true) : setLoadingMore(true);

      const { data, error } = await supabase
        .from("orders")
        // Deliberately exclude user_data from list queries — only fetch it when expanding
        .select(
          "id, order_id, status, created_at, service_id, service:services(name)",
        )
        .eq("status", status)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (!error && data) {
        setOrders((prev) => (replace ? data : [...prev, ...data]));
        setHasMore(data.length === PAGE_SIZE);
        setPage(pageIndex);
      }

      setFetching(false);
      setLoadingMore(false);
    },
    [],
  );

  // Fetch user_data for a single order on demand (when expanded)
  const fetchOrderDetail = async (orderId) => {
    const { data, error } = await supabase
      .from("orders")
      .select("user_data, receipt_url")
      .eq("id", orderId)
      .single();
    if (!error && data) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, user_data: data.user_data, receipt_url: data.receipt_url }
            : o,
        ),
      );
    }
  };

  // Initial load and tab switch
  useEffect(() => {
    setOrders([]);
    setExpandedOrders({});
    setSearchOrderId("");
    fetchOrders(activeStatus, 0, true);
  }, [activeStatus, fetchOrders]);

  const handleRefresh = () => {
    setOrders([]);
    setExpandedOrders({});
    fetchOrders(activeStatus, 0, true);
    refreshOrderSummary();
  };

  const handleLoadMore = () => {
    fetchOrders(activeStatus, page + 1, false);
  };

  // ─── Expand / collapse ───────────────────────────────────────────────────

  const toggleExpand = (order) => {
    const isOpen = expandedOrders[order.id];
    setExpandedOrders((prev) => ({ ...prev, [order.id]: !isOpen }));
    // Lazy-load user_data only on first expand
    if (!isOpen && order.user_data === undefined) {
      fetchOrderDetail(order.id);
    }
  };

  // ─── Status update ───────────────────────────────────────────────────────

  const handleStatusChange = async (order, newStatus) => {
    await updateOrderStatus(order.id, newStatus);
    // Remove from current list if it no longer matches the active tab
    if (newStatus !== activeStatus) {
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o)),
      );
    }
    refreshOrderSummary();
  };

  // ─── Delete ──────────────────────────────────────────────────────────────

  const handleDeleteOrder = (id) => {
    setOrderIdToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (orderIdToDelete) {
      await deleteOrder(orderIdToDelete);
      setOrders((prev) => prev.filter((o) => o.id !== orderIdToDelete));
      setIsConfirmModalOpen(false);
      setOrderIdToDelete(null);
      refreshOrderSummary();
    }
  };

  // ─── Service lookup ──────────────────────────────────────────────────────

  const getServiceForOrder = (order) => {
    if (!order.service_id) return null;
    for (const list of Object.values(services)) {
      const found = list.find((s) => s.id === order.service_id);
      if (found) return found;
    }
    return null;
  };

  // ─── File helpers ────────────────────────────────────────────────────────

  const isStorageUrl = (val) =>
    typeof val === "string" &&
    (val.startsWith("https://") || val.startsWith("http://"));

  const isImageUrl = (val) =>
    isStorageUrl(val) && /\.(jpe?g|png|gif|webp|bmp|svg)(\?|$)/i.test(val);

  const isBase64 = (val) => typeof val === "string" && val.startsWith("data:");
  const isBase64Img = (val) =>
    typeof val === "string" && val.startsWith("data:image");

  const downloadFromUrl = async (url, baseName) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const urlFileName = decodeURIComponent(
        new URL(url).pathname.split("/").pop(),
      );
      link.href = objectUrl;
      link.download = urlFileName || baseName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  const downloadBase64 = (dataUrl, baseName) => {
    const mimeMatch = dataUrl.match(/^data:([^;]+);/);
    const mime = mimeMatch ? mimeMatch[1] : "";
    const mimeMap = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "image/bmp": "bmp",
      "application/pdf": "pdf",
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "docx",
      "application/vnd.ms-excel": "xls",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        "xlsx",
      "text/plain": "txt",
      "text/csv": "csv",
    };
    const ext = mimeMap[mime] || "bin";
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${baseName.replace(/\.[^.]+$/, "")}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ─── Field renderer ──────────────────────────────────────────────────────

  const renderFieldValue = (fieldName, value) => {
    if (!value) {
      return (
        <div key={fieldName}>
          <span className="font-medium text-gray-700">{fieldName}:</span>
          <span className="ml-2 text-gray-400 italic">N/A</span>
        </div>
      );
    }

    // Storage URL — image
    if (isImageUrl(value)) {
      return (
        <div key={fieldName} className="space-y-2">
          <span className="font-medium text-gray-700 block">{fieldName}:</span>
          <img
            src={value}
            alt={fieldName}
            loading="lazy"
            className="max-h-48 object-contain rounded-xl border border-gray-200"
          />
          <button
            onClick={() => downloadFromUrl(value, fieldName)}
            className="bg-[#4169E1] hover:bg-[#3658c9] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <i className="fas fa-download"></i> Download
          </button>
        </div>
      );
    }

    // Storage URL — non-image file
    if (isStorageUrl(value)) {
      return (
        <div key={fieldName} className="space-y-1">
          <span className="font-medium text-gray-700 block">{fieldName}:</span>
          <button
            onClick={() => downloadFromUrl(value, fieldName)}
            className="bg-[#4169E1] hover:bg-[#3658c9] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <i className="fas fa-download"></i> Download File
          </button>
        </div>
      );
    }

    // Legacy base64 — image
    if (isBase64Img(value)) {
      return (
        <div key={fieldName} className="space-y-2">
          <span className="font-medium text-gray-700 block">{fieldName}:</span>
          <img
            src={value}
            alt={fieldName}
            loading="lazy"
            className="max-h-48 object-contain rounded-xl border border-gray-200"
          />
          <button
            onClick={() => downloadBase64(value, fieldName)}
            className="bg-[#4169E1] hover:bg-[#3658c9] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <i className="fas fa-download"></i> Download
          </button>
        </div>
      );
    }

    // Legacy base64 — non-image file
    if (isBase64(value)) {
      return (
        <div key={fieldName} className="space-y-1">
          <span className="font-medium text-gray-700 block">{fieldName}:</span>
          <button
            onClick={() => downloadBase64(value, fieldName)}
            className="bg-[#4169E1] hover:bg-[#3658c9] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <i className="fas fa-download"></i> Download File
          </button>
        </div>
      );
    }

    // Plain text
    return (
      <div key={fieldName}>
        <span className="font-medium text-gray-700">{fieldName}:</span>
        <span className="ml-2 text-gray-800 break-all">{value}</span>
      </div>
    );
  };

  // ─── Filter by search ────────────────────────────────────────────────────

  const visibleOrders = searchOrderId.trim()
    ? orders.filter((o) =>
        o.order_id?.toLowerCase().includes(searchOrderId.toLowerCase()),
      )
    : orders;

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h2 className="text-2xl font-bold text-gray-900">Orders Manager</h2>
        <button
          onClick={handleRefresh}
          disabled={fetching}
          className="flex items-center gap-2 bg-[#4169E1] hover:bg-[#3658c9] disabled:bg-gray-300 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <i className={`fas fa-rotate-right ${fetching ? "fa-spin" : ""}`}></i>
          Refresh
        </button>
      </div>

      {/* Status Pill Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveStatus(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
              activeStatus === tab.key
                ? `${tab.badge} border-transparent shadow-sm`
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${tab.dot}`}></span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={searchOrderId}
          onChange={(e) => setSearchOrderId(e.target.value)}
          placeholder="Search by order ID..."
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 text-sm"
        />
        {searchOrderId && (
          <button
            onClick={() => setSearchOrderId("")}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Order List */}
      {fetching ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-[#4169E1] mb-3"></i>
            <p className="text-gray-500 text-sm">Loading orders...</p>
          </div>
        </div>
      ) : visibleOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-lg text-center text-gray-400">
          <i className="fas fa-inbox text-5xl mb-4 block text-gray-200"></i>
          <p className="font-medium">
            {searchOrderId
              ? "No order matches that ID"
              : `No ${activeStatus} orders`}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {visibleOrders.map((order) => {
              const service = getServiceForOrder(order);
              const isExpanded = expandedOrders[order.id];
              const tab = STATUS_TABS.find((t) => t.key === order.status);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* Header row */}
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleExpand(order)}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-900 text-sm truncate">
                          #{order.order_id}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tab?.badge || "bg-gray-100 text-gray-700"}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {service?.name ||
                          order.service?.name ||
                          "Unknown service"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>

                    <div
                      className="flex items-center gap-2 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order, e.target.value)
                        }
                        className="px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] bg-white"
                      >
                        <option value="pending_verification">
                          Needs Verification
                        </option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-xl text-sm transition-colors"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                      <i
                        className={`fas fa-chevron-${isExpanded ? "up" : "down"} text-gray-300 text-xs`}
                      ></i>
                    </div>
                  </div>

                  {/* Expanded detail — user_data loaded on demand */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50 p-4">
                      {order.user_data === undefined ? (
                        <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
                          <i className="fas fa-spinner fa-spin"></i>
                          Loading details...
                        </div>
                      ) : (
                        <>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            Customer Details
                          </h4>
                          <div className="flex flex-col gap-3 text-sm">
                            {service?.fields?.length > 0
                              ? service.fields.map((field) =>
                                  renderFieldValue(
                                    field.name,
                                    order.user_data?.[field.name],
                                  ),
                                )
                              : Object.entries(order.user_data || {}).map(
                                  ([key, val]) => renderFieldValue(key, val),
                                )}
                          </div>

                          {/* Receipt / Proof of Payment */}
                          {order.receipt_url && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                Proof of Payment
                              </h4>
                              {isImageUrl(order.receipt_url) ? (
                                <div className="space-y-2">
                                  <img
                                    src={order.receipt_url}
                                    alt="Payment receipt"
                                    loading="lazy"
                                    className="max-h-64 object-contain rounded-xl border border-gray-200"
                                  />
                                  <button
                                    onClick={() =>
                                      downloadFromUrl(
                                        order.receipt_url,
                                        "receipt",
                                      )
                                    }
                                    className="bg-[#4169E1] hover:bg-[#3658c9] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                  >
                                    <i className="fas fa-download"></i> Download
                                    Receipt
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() =>
                                    downloadFromUrl(
                                      order.receipt_url,
                                      "receipt",
                                    )
                                  }
                                  className="bg-[#4169E1] hover:bg-[#3658c9] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                  <i className="fas fa-download"></i> Download
                                  Receipt
                                </button>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Load More */}
          {hasMore && !searchOrderId && (
            <div className="mt-6 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="bg-white border border-gray-200 hover:border-[#4169E1] hover:text-[#4169E1] text-gray-600 px-8 py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
              >
                {loadingMore ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>Loading...
                  </>
                ) : (
                  "Load more orders"
                )}
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setOrderIdToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Order"
        message="Are you sure you want to delete this order? This action cannot be undone."
      />
    </div>
  );
}
