import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Home,
  Search,
  ShoppingCart,
  Clock,
  Star,
  User,
  LogOut,
  Menu,
  X
} from "lucide-react";

const CusDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [restaurantError, setRestaurantError] = useState(null);

  const logout = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("username");
    navigate("/");
  };

  const name = localStorage.getItem("name");
  const username = localStorage.getItem("username");

  // Navigation items
  const navItems = [
    { path: "/CusDashboard", icon: Home, label: "Home", exact: true },
    { path: "/CusDashboard/restaurants", icon: Search, label: "Restaurants" },
    { path: "/CusDashboard/cart", icon: ShoppingCart, label: "Cart", badge: cartItemCount },
    { path: "/CusDashboard/orders", icon: Clock, label: "Orders" },
    { path: "/CusDashboard/reviews", icon: Star, label: "Reviews" },
    { path: "/CusDashboard/profile", icon: User, label: "Profile" },
  ];

  const isActiveRoute = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Fetch cart count and restaurants on component mount
  useEffect(() => {
    fetchCartCount();
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoadingRestaurants(true);
      setRestaurantError(null);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:9090/api/restaurants", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data);
      } else {
        setRestaurantError("Failed to load restaurants");
      }
    } catch (error) {
      setRestaurantError("Error loading restaurants");
    } finally {
      setLoadingRestaurants(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:9090/customer/cart", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const cartData = await response.json();
        setCartItemCount(cartData.totalItems || 0);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-orange-600">FoodDelivery</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.path, item.exact);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                      isActive
                        ? "text-orange-600 bg-orange-50"
                        : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {item.label}
                    {item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-sm text-gray-600">
                Welcome, {name || username || "Customer"}!
              </div>
              <button
                onClick={logout}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-orange-600 hover:bg-orange-50"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.path, item.exact);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors relative ${
                      isActive
                        ? "text-orange-600 bg-orange-50"
                        : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                    {item.badge > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Restaurant List */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-orange-700">Restaurants</h2>
          {selectedRestaurant ? (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <button className="mb-4 text-orange-600 underline" onClick={() => setSelectedRestaurant(null)}>&larr; Back to Restaurants</button>
              <h3 className="text-xl font-bold mb-2 text-orange-700">{selectedRestaurant.name || 'Sample Restaurant'}</h3>
              <p className="text-gray-700 mb-1">{selectedRestaurant.description || 'This is a sample restaurant for demo purposes.'}</p>
              <p className="text-gray-500 text-sm mb-1">Location: {selectedRestaurant.location || 'Demo City'}</p>
              <p className="text-gray-500 text-sm mb-1">Contact: {selectedRestaurant.contact || '1234567890'}</p>
              <p className="text-gray-500 text-sm mb-1">Timings: {selectedRestaurant.openingTime || '09:00'} - {selectedRestaurant.closingTime || '22:00'}</p>
              <p className="text-gray-500 text-sm mb-1">Delivery Fee: ₹{selectedRestaurant.deliveryFee || 30}</p>
              <p className="text-gray-500 text-sm mb-1">Min Order: ₹{selectedRestaurant.minOrderAmount || 100}</p>
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Menu Items</h4>
                <ul className="space-y-2">
                  <li className="border p-3 rounded flex justify-between items-center">
                    <span>Dummy Butter Chicken</span>
                    <span className="text-indigo-600 font-bold">₹350</span>
                  </li>
                  <li className="border p-3 rounded flex justify-between items-center">
                    <span>Dummy Masala Dosa</span>
                    <span className="text-indigo-600 font-bold">₹120</span>
                  </li>
                  <li className="border p-3 rounded flex justify-between items-center">
                    <span>Dummy Paneer Tikka</span>
                    <span className="text-indigo-600 font-bold">₹280</span>
                  </li>
                </ul>
                <button
                  className="mt-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
                  onClick={() => alert('Ordered successfully!')}
                >
                  Place Order
                </button>
              </div>
            </div>
          ) : loadingRestaurants ? (
            <div className="text-gray-500">Loading restaurants...</div>
          ) : restaurantError ? (
            <div className="text-red-500">{restaurantError}</div>
          ) : restaurants.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Dummy restaurant card */}
              <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer" onClick={() => setSelectedRestaurant({})}>
                <img
                  src="/placeholder.svg"
                  alt="Dummy Restaurant"
                  className="w-full h-40 object-cover mb-3 rounded"
                />
                <h3 className="text-lg font-semibold mb-2 text-orange-600">Sample Restaurant</h3>
                <p className="text-gray-700 mb-1">This is a sample restaurant for demo purposes. Real restaurants will appear here when available.</p>
                <p className="text-gray-500 text-sm mb-1">Location: Demo City</p>
                <p className="text-gray-500 text-sm mb-1">Contact: 1234567890</p>
                <p className="text-gray-500 text-sm mb-1">Timings: 09:00 - 22:00</p>
                <p className="text-gray-500 text-sm mb-1">Delivery Fee: ₹30</p>
                <p className="text-gray-500 text-sm mb-1">Min Order: ₹100</p>
                <p className="text-gray-400 text-xs">Owner ID: 0</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((rest) => (
                <div key={rest.id} className="bg-white rounded-lg shadow-md p-6 cursor-pointer" onClick={() => setSelectedRestaurant(rest)}>
                  {rest.imageUrl && (
                    <img
                      src={rest.imageUrl}
                      alt={rest.name}
                      className="w-full h-40 object-cover mb-3 rounded"
                      onError={e => { e.target.src = '/placeholder.svg'; }}
                    />
                  )}
                  <h3 className="text-lg font-semibold mb-2 text-orange-600">{rest.name}</h3>
                  <p className="text-gray-700 mb-1">{rest.description}</p>
                  <p className="text-gray-500 text-sm mb-1">Location: {rest.location}</p>
                  <p className="text-gray-500 text-sm mb-1">Contact: {rest.contact}</p>
                  <p className="text-gray-500 text-sm mb-1">Timings: {rest.openingTime} - {rest.closingTime}</p>
                  {rest.deliveryFee !== undefined && rest.deliveryFee !== null && (
                    <p className="text-gray-500 text-sm mb-1">Delivery Fee: ₹{rest.deliveryFee}</p>
                  )}
                  {rest.minOrderAmount !== undefined && rest.minOrderAmount !== null && (
                    <p className="text-gray-500 text-sm mb-1">Min Order: ₹{rest.minOrderAmount}</p>
                  )}
                  {rest.ownerId && (
                    <p className="text-gray-400 text-xs">Owner ID: {rest.ownerId}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
        <Outlet context={{ fetchCartCount }} />
      </main>
    </div>
  );
};

export default CusDashboard;

