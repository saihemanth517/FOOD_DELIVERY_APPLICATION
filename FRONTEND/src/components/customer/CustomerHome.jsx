import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Clock, MapPin, Search, Filter } from "lucide-react";
import axios from "axios";

const CustomerHome = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [topRatedRestaurants, setTopRatedRestaurants] = useState([]);
  const [cuisineTypes, setCuisineTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      // Fetch all restaurants
      const restaurantsResponse = await axios.get("http://localhost:9090/customer/restaurants", { headers });
      setRestaurants(restaurantsResponse.data);

      // Fetch top rated restaurants
      const topRatedResponse = await axios.get("http://localhost:9090/customer/restaurants/top-rated?limit=6", { headers });
      setTopRatedRestaurants(topRatedResponse.data);

      // Fetch cuisine types
      const cuisinesResponse = await axios.get("http://localhost:9090/customer/restaurants/cuisines", { headers });
      setCuisineTypes(cuisinesResponse.data);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm && !selectedCuisine) {
      fetchInitialData();
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const searchRequest = {
        searchTerm: searchTerm || null,
        cuisineType: selectedCuisine || null,
        page: 0,
        size: 20
      };

      const response = await axios.post("http://localhost:9090/customer/restaurants/search", searchRequest, { headers });
      setRestaurants(response.data.content);
    } catch (error) {
      console.error("Error searching restaurants:", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCuisine("");
    fetchInitialData();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to FoodDelivery!</h1>
        <p className="text-lg opacity-90">Discover amazing restaurants and delicious food near you</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Cuisines</option>
              {cuisineTypes.map((cuisine) => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Search
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Top Rated Restaurants */}
      {topRatedRestaurants.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Top Rated Restaurants</h2>
            <Link
              to="/CusDashboard/restaurants"
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topRatedRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </section>
      )}

      {/* All Restaurants */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {searchTerm || selectedCuisine ? "Search Results" : "All Restaurants"}
        </h2>
        {restaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No restaurants found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

// Restaurant Card Component
const RestaurantCard = ({ restaurant }) => {
  return (
    <Link
      to={`/CusDashboard/restaurants/${restaurant.id}`}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="relative">
        <img
          src={restaurant.imageUrl || "/placeholder-restaurant.jpg"}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
        {restaurant.deliveryFee === 0 && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Free Delivery
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{restaurant.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{restaurant.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
            <span className="font-medium">{restaurant.rating?.toFixed(1) || "New"}</span>
            {restaurant.totalReviews > 0 && (
              <span className="ml-1">({restaurant.totalReviews})</span>
            )}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{restaurant.avgDeliveryTime || 30} mins</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{restaurant.cuisineType}</span>
          </div>
          <div className="text-sm text-gray-600">
            ₹{restaurant.deliveryFee} delivery
          </div>
        </div>

        {restaurant.minOrderAmount > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            Min order: ₹{restaurant.minOrderAmount}
          </div>
        )}
      </div>
    </Link>
  );
};

export default CustomerHome;
