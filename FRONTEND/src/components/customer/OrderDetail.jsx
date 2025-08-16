import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle, 
  Truck, 
  ChefHat, 
  X,
  Star,
  CreditCard,
  Receipt
} from "lucide-react";
import axios from "axios";

const OrderDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (location.state?.orderPlaced) {
      setOrderPlaced(true);
    }
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await axios.get(`http://localhost:9090/customer/orders/${id}`, { headers });
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case "CONFIRMED":
        return <CheckCircle className="h-6 w-6 text-blue-500" />;
      case "PREPARING":
        return <ChefHat className="h-6 w-6 text-orange-500" />;
      case "READY_FOR_PICKUP":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "OUT_FOR_DELIVERY":
        return <Truck className="h-6 w-6 text-purple-500" />;
      case "DELIVERED":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "CANCELLED":
        return <X className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PREPARING":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "READY_FOR_PICKUP":
        return "bg-green-100 text-green-800 border-green-200";
      case "OUT_FOR_DELIVERY":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Order not found</p>
        <Link
          to="/CusDashboard/orders"
          className="text-orange-600 hover:text-orange-700 font-medium mt-4 inline-block"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success Message */}
      {orderPlaced && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-green-900">Order Placed Successfully!</h3>
              <p className="text-green-700">Your order has been confirmed and is being processed.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/CusDashboard/orders"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)}
          <span className="ml-2 font-medium">{formatStatus(order.status)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Timeline */}
          {order.deliveryStatusUpdates && order.deliveryStatusUpdates.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
              <div className="space-y-4">
                {order.deliveryStatusUpdates.map((status, index) => (
                  <div key={status.id} className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(status.status)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{formatStatus(status.status)}</p>
                      <p className="text-sm text-gray-600">{status.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(status.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Restaurant Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Restaurant</h3>
            <div className="flex items-center gap-4">
              <img
                src={order.restaurantImageUrl || "/placeholder-restaurant.jpg"}
                alt={order.restaurantName}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{order.restaurantName}</h4>
                {order.restaurantPhone && (
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Phone className="h-4 w-4 mr-1" />
                    <span>{order.restaurantPhone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.orderItems?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0">
                  <img
                    src={item.menuItemImageUrl || "/placeholder-food.jpg"}
                    alt={item.itemName}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.itemName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {item.isVegetarian && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Veg</span>
                      )}
                      {item.isVegan && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Vegan</span>
                      )}
                      {item.spiceLevel && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">{item.spiceLevel}</span>
                      )}
                    </div>
                    {item.specialInstructions && (
                      <p className="text-sm text-gray-600 italic mt-1">
                        Note: {item.specialInstructions}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{item.price} × {item.quantity}</p>
                    <p className="text-sm text-gray-600">₹{item.totalPrice?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Delivery Address</p>
                  <p className="text-gray-600">{order.deliveryAddress}</p>
                </div>
              </div>
              
              {order.customerPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Contact Number</p>
                    <p className="text-gray-600">{order.customerPhone}</p>
                  </div>
                </div>
              )}

              {order.estimatedDeliveryTime && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Estimated Delivery</p>
                    <p className="text-gray-600">{formatDate(order.estimatedDeliveryTime)}</p>
                  </div>
                </div>
              )}

              {order.actualDeliveryTime && (
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">Delivered At</p>
                    <p className="text-gray-600">{formatDate(order.actualDeliveryTime)}</p>
                  </div>
                </div>
              )}
            </div>

            {order.deliveryPartnerName && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="font-medium text-gray-900">Delivery Partner</p>
                <p className="text-gray-600">{order.deliveryPartnerName}</p>
                {order.deliveryPartnerPhone && (
                  <p className="text-sm text-gray-500">{order.deliveryPartnerPhone}</p>
                )}
              </div>
            )}
          </div>

          {/* Special Instructions */}
          {order.specialInstructions && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Instructions</h3>
              <p className="text-gray-600">{order.specialInstructions}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{order.subtotal?.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">₹{order.deliveryFee?.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxes & Fees</span>
                <span className="font-medium">₹{order.taxAmount?.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-semibold text-gray-900">₹{order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Payment Method</p>
                  <p className="text-gray-600">
                    {order.paymentMethod === "RAZORPAY" ? "Online Payment" : "Cash on Delivery"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Receipt className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Payment Status</p>
                  <p className={`text-sm font-medium ${
                    order.paymentStatus === "COMPLETED" ? "text-green-600" : 
                    order.paymentStatus === "FAILED" ? "text-red-600" : "text-yellow-600"
                  }`}>
                    {order.paymentStatus}
                  </p>
                </div>
              </div>

              {order.paymentId && (
                <div className="text-xs text-gray-500">
                  Payment ID: {order.paymentId}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {order.status === "DELIVERED" && order.canReview && !order.hasReviewed && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Your Experience</h3>
              <Link
                to={`/CusDashboard/reviews?orderId=${order.id}`}
                className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Star className="h-4 w-4 mr-2" />
                Write Review
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
