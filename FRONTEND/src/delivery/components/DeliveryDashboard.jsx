import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import IncomingOrders from "./IncomingOrders";

// Toast component
function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-slide-in">
      {message}
    </div>
  );
}

export default function DeliveryDashboard() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const dropdownRef = useRef();

  useEffect(() => {
    if (!token) {
       navigate("/delivery/login");
      return;
    }

    const fetchData = async () => {
      try {
        const availRes = await axios.get("http://localhost:9099/api/delivery/auth/availability", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAvailable(availRes.data.isAvailable);

        const profileRes = await axios.get("http://localhost:9099/api/delivery/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(profileRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const toggleAvailability = async () => {
    try {
      const response = await axios.put(
        "http://localhost:9099/api/delivery/auth/availability",
        { isAvailable: !isAvailable },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsAvailable(response.data.isAvailable);
    } catch (err) {
      console.error("Failed to update availability", err);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('https://plus.unsplash.com/premium_photo-1661526833843-248a2f8fe129?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
      }}
    >
      <div className="bg-black bg-opacity-60 min-h-screen backdrop-blur-sm">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 py-4 bg-orange-400 bg-opacity-90 shadow-md">
          <h1 className="text-xl font-bold text-gray-800">Delivery Dashboard</h1>

          <div className="flex items-center space-x-6">
            {/* Toggle */}
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">
                {isAvailable ? "ACTIVE" : "INACTIVE"}
              </span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isAvailable}
                  onChange={toggleAvailability}
                />
                <div
                  className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors duration-300 ${
                    isAvailable ? "bg-green-500" : "bg-red-500"
                  }`}
                  style={{
                    justifyContent: isAvailable ? "flex-end" : "flex-start",
                  }}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </label>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
  <button
    onClick={() => setShowDropdown(!showDropdown)}
    className="w-10 h-10 bg-white rounded flex flex-col justify-center items-center space-y-1 shadow hover:bg-gray-100"
  >
    <div className="w-6 h-0.5 bg-gray-700"></div>
    <div className="w-6 h-0.5 bg-gray-700"></div>
    <div className="w-6 h-0.5 bg-gray-700"></div>
  </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50 p-4 space-y-3">
                  <Link to="/profile" className="block text-gray-800 hover:text-indigo-600">
                    My Profile
                  </Link>
                  <Link to="/delivery/history" className="block text-gray-800 hover:text-indigo-600">
                    Order History
                  </Link>


                <Link to="/delivery/feedback" className="block text-gray-800 hover:text-indigo-600">
  Ratings & Feedback
</Link>



                  
                  <Link to="/about" className="block text-gray-800 hover:text-indigo-600">
  About Us
</Link>

                  <Link to="/support" className="block text-gray-800 hover:text-indigo-600">
  Help & Support
</Link>

                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/delivery/login");
                    }}
                    className="w-full text-left text-red-500 hover:text-red-600 font-semibold"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Welcome Section */}
        <div className="px-4 py-6 max-w-4xl mx-auto">
          <div className="text-white text-center space-y-2 mb-6">
            <h2 className="text-3xl font-semibold">Welcome, {profile.fullName}</h2>
            <p className="text-lg">
              You are currently{" "}
              <span className="font-bold">
                {isAvailable ? "ACTIVE" : "INACTIVE"}
              </span>
            </p>
          </div>

          <IncomingOrders
            token={token}
            isAvailable={isAvailable}
            onToast={(msg) => setToastMessage(msg)}
          />
        </div>

        {/* Toast */}
        {toastMessage && (
          <Toast message={toastMessage} onClose={() => setToastMessage("")} />
        )}
      </div>
    </div>
  );
}
