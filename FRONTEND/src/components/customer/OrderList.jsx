import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin, Star, Eye, X, CheckCircle, Truck, ChefHat } from "lucide-react";
import axios from "axios";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); // active, all
  const [cancelling, setCancelling] = useState({});

  useEffect(() => {
    fetchOrders();
    fetchActiveOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await axios.get("http://localhost:9090/customer/orders", { headers });
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const fetchActiveOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await axios.get("http://localhost:9090/customer/orders/active", { headers });
      setActiveOrders(response.data);
    } catch (error) {
      console.error("Error fetching active orders:", error);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    setCancelling(prev => ({ ...prev, [orderId]: true }));

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await axios.put(
        `http://localhost:9090/customer/orders/${orderId}/cancel`,
        {},
        { headers }
      );

      if (response.data.success) {
        // Refresh orders
        fetchOrders();
        fetchActiveOrders();
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    } finally {
      setCancelling(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "CONFIRMED":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case "PREPARING":
        return <ChefHat className="h-5 w-5 text-orange-500" />;
      case "READY_FOR_PICKUP":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "OUT_FOR_DELIVERY":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "DELIVERED":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "CANCELLED":
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "PREPARING":
        return "bg-orange-100 text-orange-800";
      case "READY_FOR_PICKUP":
        return "bg-green-100 text-green-800";
      case "OUT_FOR_DELIVERY":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const canCancelOrder = (order) => {
    return !["DELIVERED", "CANCELLED", "OUT_FOR_DELIVERY"].includes(order.status);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const displayOrders = activeTab === "active" ? activeOrders : orders;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-1">Track your current and past orders</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("active")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "active"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Active Orders ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "all"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            All Orders ({orders.length})
          </button>
        </nav>
      </div>

      {/* Orders List */}
      {displayOrders.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {activeTab === "active" ? "No active orders" : "No orders yet"}
          </h2>
          <p className="text-gray-600 mb-6">
            {activeTab === "active" 
              ? "You don't have any active orders at the moment"
              : "Start by ordering some delicious food!"
            }
          </p>
          <Link
            to="/CusDashboard/restaurants"
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Browse Restaurants
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {displayOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onCancel={cancelOrder}
              cancelling={cancelling[order.id]}
              canCancel={canCancelOrder(order)}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              formatStatus={formatStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Order Card Component
const OrderCard = ({ 
  order, 
  onCancel, 
  cancelling, 
  canCancel, 
  getStatusIcon, 
  getStatusColor, 
  formatStatus 
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Order #{order.orderNumber}
            </h3>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="ml-1">{formatStatus(order.status)}</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <span className="font-medium">{order.restaurantName}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{order.deliveryAddress}</span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900">₹{order.totalAmount?.toFixed(2)}</p>
          <p className="text-sm text-gray-600">{order.orderItems?.length} items</p>
        </div>
      </div>

      {/* Order Items Preview */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {order.orderItems?.slice(0, 3).map((item, index) => (
            <span key={index} className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {item.quantity}x {item.itemName}
            </span>
          ))}
          {order.orderItems?.length > 3 && (
            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
              +{order.orderItems.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Estimated Delivery Time */}
      {order.estimatedDeliveryTime && order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center text-sm text-blue-800">
            <Clock className="h-4 w-4 mr-2" />
            <span>
              Estimated delivery: {formatDate(order.estimatedDeliveryTime)}
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <Link
            to={`/CusDashboard/orders/${order.id}`}
            className="flex items-center text-orange-600 hover:text-orange-700 font-medium"
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Link>
          
          {order.status === "DELIVERED" && order.canReview && !order.hasReviewed && (
            <Link
              to={`/CusDashboard/reviews?orderId=${order.id}`}
              className="flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              <Star className="h-4 w-4 mr-1" />
              Write Review
            </Link>
          )}
        </div>

        {canCancel && (
          <button
            onClick={() => onCancel(order.id)}
            disabled={cancelling}
            className="flex items-center text-red-600 hover:text-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelling ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
            ) : (
              <X className="h-4 w-4 mr-1" />
            )}
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderList;
