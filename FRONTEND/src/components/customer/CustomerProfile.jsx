import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Calendar, Star, ShoppingBag, CreditCard } from "lucide-react";
import axios from "axios";

const CustomerProfile = () => {
  const [profile, setProfile] = useState({
    name: localStorage.getItem("name") || "",
    username: localStorage.getItem("username") || "",
    phone: "",
    address: ""
  });
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    averageRating: 0,
    totalReviews: 0
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfileStats();
  }, []);

  const fetchProfileStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      // Fetch orders to calculate stats
      const ordersResponse = await axios.get("http://localhost:9090/customer/orders", { headers });
      const orders = ordersResponse.data;

      // Fetch reviews to calculate review stats
      const reviewsResponse = await axios.get("http://localhost:9090/customer/reviews", { headers });
      const reviews = reviewsResponse.data;

      // Calculate stats
      const totalOrders = orders.length;
      const totalSpent = orders
        .filter(order => order.status === "DELIVERED")
        .reduce((sum, order) => sum + order.totalAmount, 0);
      
      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;

      setStats({
        totalOrders,
        totalSpent,
        averageRating,
        totalReviews: reviews.length
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile stats:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const saveProfile = async () => {
    setSaving(true);
    
    try {
      // Since we don't have a profile update endpoint, we'll just update localStorage
      // In a real app, you would call an API to update the profile
      localStorage.setItem("name", profile.name);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(amount);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 text-orange-600 hover:text-orange-700 font-medium"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {profile.name || "Customer"}
                  </h3>
                  <p className="text-gray-600">Food Lover</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-900">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{profile.name || "Not provided"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{profile.username}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-900">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{profile.phone || "Not provided"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>January 2024</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Address
                </label>
                {editing ? (
                  <textarea
                    value={profile.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter your default delivery address"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                ) : (
                  <div className="flex items-start gap-2 text-gray-900">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                    <span>{profile.address || "No default address set"}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Order Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-600">Total Orders</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.totalOrders}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600">Total Spent</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(stats.totalSpent)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-600">Avg. Rating Given</span>
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(stats.averageRating)}
                  <span className="text-sm text-gray-600 ml-1">
                    ({stats.averageRating.toFixed(1)})
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-600">Reviews Written</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.totalReviews}</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
            <div className="space-y-3">
              {stats.totalOrders >= 1 && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">First Order</p>
                    <p className="text-sm text-green-700">Welcome to FoodDelivery!</p>
                  </div>
                </div>
              )}

              {stats.totalOrders >= 5 && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Regular Customer</p>
                    <p className="text-sm text-blue-700">5+ orders completed</p>
                  </div>
                </div>
              )}

              {stats.totalReviews >= 3 && (
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-purple-900">Reviewer</p>
                    <p className="text-sm text-purple-700">Helpful feedback provider</p>
                  </div>
                </div>
              )}

              {stats.totalOrders === 0 && stats.totalReviews === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500">Complete orders and write reviews to earn achievements!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
