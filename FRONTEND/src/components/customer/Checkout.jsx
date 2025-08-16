import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { MapPin, Phone, CreditCard, Wallet, ArrowLeft, CheckCircle } from "lucide-react";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const { fetchCartCount } = useOutletContext();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [orderData, setOrderData] = useState({
    deliveryAddress: "",
    customerPhone: "",
    paymentMethod: "RAZORPAY",
    specialInstructions: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await axios.get("http://localhost:9090/customer/cart", { headers });
      
      if (!response.data || !response.data.cartItems || response.data.cartItems.length === 0) {
        navigate("/CusDashboard/cart");
        return;
      }

      setCart(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart:", error);
      navigate("/CusDashboard/cart");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!orderData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = "Delivery address is required";
    }

    if (!orderData.customerPhone.trim()) {
      newErrors.customerPhone = "Phone number is required";
    } else if (!/^[+]?[0-9]{10,15}$/.test(orderData.customerPhone.replace(/\s/g, ""))) {
      newErrors.customerPhone = "Please enter a valid phone number";
    }

    if (!orderData.paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async (order) => {
    const res = await initializeRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load. Please check your internet connection.");
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_key", // Replace with your Razorpay key
      amount: Math.round(cart.grandTotal * 100), // Amount in paise
      currency: "INR",
      name: "FoodDelivery",
      description: `Order from ${cart.restaurantName}`,
      order_id: order.orderNumber,
      handler: async function (response) {
        try {
          const token = localStorage.getItem("token");
          const headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          };

          await axios.put(
            `http://localhost:9090/customer/orders/${order.orderNumber}/payment`,
            null,
            {
              headers,
              params: {
                paymentStatus: "COMPLETED",
                paymentId: response.razorpay_payment_id
              }
            }
          );

          // Update cart count
          if (fetchCartCount) {
            fetchCartCount();
          }

          // Navigate to order success page
          navigate(`/CusDashboard/orders/${order.id}`, { 
            state: { orderPlaced: true } 
          });
        } catch (error) {
          console.error("Error updating payment status:", error);
          alert("Payment successful but there was an error updating the order. Please contact support.");
        }
      },
      prefill: {
        name: localStorage.getItem("name") || "",
        email: localStorage.getItem("username") || "",
        contact: orderData.customerPhone
      },
      theme: {
        color: "#ea580c"
      },
      modal: {
        ondismiss: function() {
          setPlacing(false);
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const placeOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setPlacing(true);

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await axios.post(
        "http://localhost:9090/customer/orders",
        orderData,
        { headers }
      );

      if (response.data.success) {
        const order = response.data.order;

        if (orderData.paymentMethod === "RAZORPAY") {
          await handleRazorpayPayment(order);
        } else {
          // COD - directly navigate to success page
          if (fetchCartCount) {
            fetchCartCount();
          }
          navigate(`/CusDashboard/orders/${order.id}`, { 
            state: { orderPlaced: true } 
          });
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setPlacing(false);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to place order. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/CusDashboard/cart")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Delivery Address</h3>
            </div>
            <textarea
              value={orderData.deliveryAddress}
              onChange={(e) => handleInputChange("deliveryAddress", e.target.value)}
              placeholder="Enter your complete delivery address..."
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${
                errors.deliveryAddress ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.deliveryAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            </div>
            <input
              type="tel"
              value={orderData.customerPhone}
              onChange={(e) => handleInputChange("customerPhone", e.target.value)}
              placeholder="Enter your phone number"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.customerPhone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.customerPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="RAZORPAY"
                  checked={orderData.paymentMethod === "RAZORPAY"}
                  onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center ${
                  orderData.paymentMethod === "RAZORPAY" ? "border-orange-600" : "border-gray-300"
                }`}>
                  {orderData.paymentMethod === "RAZORPAY" && (
                    <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                  )}
                </div>
                <div className="flex items-center">
                  <Wallet className="h-5 w-5 text-gray-600 mr-2" />
                  <div>
                    <p className="font-medium">Online Payment</p>
                    <p className="text-sm text-gray-600">Pay securely with Razorpay</p>
                  </div>
                </div>
              </label>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={orderData.paymentMethod === "COD"}
                  onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center ${
                  orderData.paymentMethod === "COD" ? "border-orange-600" : "border-gray-300"
                }`}>
                  {orderData.paymentMethod === "COD" && (
                    <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                  )}
                </div>
                <div>
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-gray-600">Pay when your order arrives</p>
                </div>
              </label>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Instructions (Optional)</h3>
            <textarea
              value={orderData.specialInstructions}
              onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
              placeholder="Any special instructions for your order..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            {/* Restaurant Info */}
            <div className="mb-4 pb-4 border-b">
              <p className="font-medium text-gray-900">{cart.restaurantName}</p>
              <p className="text-sm text-gray-600">{cart.totalItems} items</p>
            </div>

            {/* Order Items */}
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {cart.cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="flex-1">
                    {item.quantity}x {item.menuItemName}
                  </span>
                  <span className="font-medium">₹{item.totalPrice?.toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 mb-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{cart.subtotal?.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">₹{cart.deliveryFee?.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxes & Fees</span>
                <span className="font-medium">₹{cart.taxAmount?.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-semibold text-gray-900">₹{cart.grandTotal?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={placeOrder}
              disabled={placing}
              className="w-full flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {placing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Placing Order...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Place Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
