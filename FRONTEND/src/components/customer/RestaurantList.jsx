import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Clock, Search, Filter, MapPin } from "lucide-react";
import axios from "axios";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [cuisineTypes, setCuisineTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxDeliveryFee, setMaxDeliveryFee] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchCuisineTypes();
    searchRestaurants();
  }, [currentPage, sortBy, sortDirection]);

  const fetchCuisineTypes = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await axios.get("http://localhost:9090/customer/restaurants/cuisines", { headers });
      setCuisineTypes(response.data);
    } catch (error) {
      console.error("Error fetching cuisine types:", error);
    }
  };

  const searchRestaurants = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const searchRequest = {
        searchTerm: searchTerm || null,
        cuisineType: selectedCuisine || null,
        minRating: minRating ? parseFloat(minRating) : null,
        maxDeliveryFee: maxDeliveryFee ? parseFloat(maxDeliveryFee) : null,
        sortBy: sortBy,
        sortDirection: sortDirection,
        page: currentPage,
        size: 12
      };

      const response = await axios.post("http://localhost:9090/customer/restaurants/search", searchRequest, { headers });
      setRestaurants(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
      setLoading(false);
    } catch (error) {
      console.error("Error searching restaurants:", error);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(0);
    searchRestaurants();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCuisine("");
    setMinRating("");
    setMaxDeliveryFee("");
    setCurrentPage(0);
    searchRestaurants();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortDirection("desc");
    }
    setCurrentPage(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
          <p className="text-gray-600 mt-1">
            {totalElements} restaurant{totalElements !== 1 ? 's' : ''} available
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
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

        {/* Advanced Filters */}
        {showFilters && (
          <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Cuisines</option>
                {cuisineTypes.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Delivery Fee</label>
              <select
                value={maxDeliveryFee}
                onChange={(e) => setMaxDeliveryFee(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Any Fee</option>
                <option value="0">Free Delivery</option>
                <option value="50">Under ₹50</option>
                <option value="100">Under ₹100</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={`${sortBy}-${sortDirection}`}
                onChange={(e) => {
                  const [newSortBy, newSortDirection] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortDirection(newSortDirection);
                  setCurrentPage(0);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="rating-desc">Highest Rated</option>
                <option value="rating-asc">Lowest Rated</option>
                <option value="deliveryTime-asc">Fastest Delivery</option>
                <option value="deliveryTime-desc">Slowest Delivery</option>
                <option value="deliveryFee-asc">Lowest Delivery Fee</option>
                <option value="deliveryFee-desc">Highest Delivery Fee</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Restaurant Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No restaurants found</p>
          <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index)}
                  className={`px-3 py-2 border rounded-lg ${
                    currentPage === index
                      ? "bg-orange-600 text-white border-orange-600"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
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

export default RestaurantList;
