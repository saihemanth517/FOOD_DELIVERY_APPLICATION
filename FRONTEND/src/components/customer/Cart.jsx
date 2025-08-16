import { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import axios from "axios";

const Cart = () => {
  const navigate = useNavigate();
  const { fetchCartCount } = useOutletContext();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

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
      setCart(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setLoading(false);
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    setUpdating(prev => ({ ...prev, [cartItemId]: true }));
    
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const updateRequest = {
        menuItemId: null, // Not needed for update
        quantity: quantity
      };

      const response = await axios.put(
        `http://localhost:9090/customer/cart/items/${cartItemId}`,
        updateRequest,
        { headers }
      );

      if (response.data.success) {
        setCart(response.data.cart);
        if (fetchCartCount) {
          fetchCartCount();
        }
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    } finally {
      setUpdating(prev => ({ ...prev, [cartItemId]: false }));
    }
  };

  const removeCartItem = async (cartItemId) => {
    setUpdating(prev => ({ ...prev, [cartItemId]: true }));
    
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await axios.delete(
        `http://localhost:9090/customer/cart/items/${cartItemId}`,
        { headers }
      );

      if (response.data.success) {
        setCart(response.data.cart);
        if (fetchCartCount) {
          fetchCartCount();
        }
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    } finally {
      setUpdating(prev => ({ ...prev, [cartItemId]: false }));
    }
  };

  const clearCart = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await axios.delete("http://localhost:9090/customer/cart/clear", { headers });

      if (response.data.success) {
        fetchCart();
        if (fetchCartCount) {
          fetchCartCount();
        }
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const proceedToCheckout = () => {
    if (cart && cart.grandTotal >= (cart.minOrderAmount || 0)) {
      navigate("/CusDashboard/checkout");
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
        <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
        <Link
          to="/CusDashboard/restaurants"
          className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Browse Restaurants
          <ArrowRight className="h-5 w-5 ml-2" />
        </Link>
      </div>
    );
  }

  const canProceedToCheckout = cart.grandTotal >= (cart.minOrderAmount || 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Restaurant Info */}
          {cart.restaurantName && (
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{cart.restaurantName}</h3>
                  <p className="text-sm text-gray-600">
                    Delivery Fee: ₹{cart.deliveryFee} • Min Order: ₹{cart.minOrderAmount}
                  </p>
                </div>
                <Link
                  to={`/CusDashboard/restaurants/${cart.restaurantId}`}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  View Menu
                </Link>
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
            {cart.cartItems.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                updateQuantity={(quantity) => updateCartItem(item.id, quantity)}
                removeItem={() => removeCartItem(item.id)}
                isUpdating={updating[item.id]}
              />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({cart.totalItems} items)</span>
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
              
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-semibold text-gray-900">₹{cart.grandTotal?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Minimum Order Warning */}
            {!canProceedToCheckout && cart.minOrderAmount > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  Add ₹{(cart.minOrderAmount - cart.subtotal).toFixed(2)} more to meet the minimum order amount
                </p>
              </div>
            )}

            {/* Checkout Button */}
            <button
              onClick={proceedToCheckout}
              disabled={!canProceedToCheckout}
              className="w-full flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Proceed to Checkout
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>

            <Link
              to="/CusDashboard/restaurants"
              className="block text-center text-orange-600 hover:text-orange-700 font-medium mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cart Item Card Component
const CartItemCard = ({ item, updateQuantity, removeItem, isUpdating }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(newQuantity);
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <img
            src={item.menuItemImageUrl || "/placeholder-food.jpg"}
            alt={item.menuItemName}
            className="w-16 h-16 object-cover rounded-lg"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-lg font-medium text-gray-900 mb-1">{item.menuItemName}</h4>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.menuItemDescription}</p>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-semibold text-gray-900">₹{item.price}</span>
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
                <p className="text-sm text-gray-600 italic mb-2">
                  Note: {item.specialInstructions}
                </p>
              )}
            </div>
            
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">₹{item.totalPrice?.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isUpdating}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={removeItem}
              disabled={isUpdating}
              className="flex items-center text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
              ) : (
                <Trash2 className="h-4 w-4 mr-1" />
              )}
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
