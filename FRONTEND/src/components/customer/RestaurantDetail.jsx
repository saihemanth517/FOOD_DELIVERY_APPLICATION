import { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { Star, Clock, MapPin, Phone, Mail, Plus, Minus, ShoppingCart, Filter } from "lucide-react";
import axios from "axios";

const RestaurantDetail = () => {
  const { id } = useParams();
  const { fetchCartCount } = useOutletContext();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const [showVegOnly, setShowVegOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (id) {
      fetchRestaurantDetails();
      fetchMenuItems();
      fetchCategories();
    }
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await axios.get(`http://localhost:9090/customer/restaurants/${id}`, { headers });
      setRestaurant(response.data);
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await axios.get(`http://localhost:9090/customer/restaurants/${id}/menu`, { headers });
      setMenuItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await axios.get(`http://localhost:9090/customer/restaurants/${id}/menu/categories`, { headers });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const addToCart = async (menuItem, quantity = 1) => {
    setAddingToCart(prev => ({ ...prev, [menuItem.id]: true }));
    
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const cartRequest = {
        menuItemId: menuItem.id,
        quantity: quantity
      };

      const response = await axios.post("http://localhost:9090/customer/cart/add", cartRequest, { headers });
      
      if (response.data.success) {
        // Update cart count in header
        if (fetchCartCount) {
          fetchCartCount();
        }
        
        // Show success message (you can implement a toast notification here)
        console.log("Item added to cart successfully");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    } finally {
      setAddingToCart(prev => ({ ...prev, [menuItem.id]: false }));
    }
  };

  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesVeg = !showVegOnly || item.isVegetarian;
    const matchesSearch = !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesVeg && matchesSearch;
  });

  const groupedMenuItems = categories.reduce((acc, category) => {
    acc[category] = filteredMenuItems.filter(item => item.category === category);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Restaurant not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Restaurant Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="relative h-64 md:h-80">
          <img
            src={restaurant.imageUrl || "/placeholder-restaurant.jpg"}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-lg opacity-90 mb-4">{restaurant.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                <span className="font-medium">{restaurant.rating?.toFixed(1) || "New"}</span>
                {restaurant.totalReviews > 0 && (
                  <span className="ml-1">({restaurant.totalReviews} reviews)</span>
                )}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{restaurant.avgDeliveryTime || 30} mins</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">{restaurant.cuisineType}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{restaurant.address}</span>
            </div>
            {restaurant.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>{restaurant.phone}</span>
              </div>
            )}
            {restaurant.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>{restaurant.email}</span>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
              Delivery Fee: ₹{restaurant.deliveryFee}
            </div>
            {restaurant.minOrderAmount > 0 && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                Min Order: ₹{restaurant.minOrderAmount}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showVegOnly}
                onChange={(e) => setShowVegOnly(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 border-2 rounded mr-2 flex items-center justify-center ${
                showVegOnly ? 'bg-green-500 border-green-500' : 'border-gray-300'
              }`}>
                {showVegOnly && <span className="text-white text-xs">✓</span>}
              </div>
              <span className="text-sm text-gray-700">Veg Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-8">
        {selectedCategory ? (
          <MenuSection
            title={selectedCategory}
            items={filteredMenuItems.filter(item => item.category === selectedCategory)}
            addToCart={addToCart}
            addingToCart={addingToCart}
          />
        ) : (
          categories.map((category) => {
            const categoryItems = groupedMenuItems[category];
            if (categoryItems.length === 0) return null;
            
            return (
              <MenuSection
                key={category}
                title={category}
                items={categoryItems}
                addToCart={addToCart}
                addingToCart={addingToCart}
              />
            );
          })
        )}
      </div>

      {filteredMenuItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No menu items found</p>
          <p className="text-gray-400 mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

// Menu Section Component
const MenuSection = ({ title, items, addToCart, addingToCart }) => {
  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            addToCart={addToCart}
            isAdding={addingToCart[item.id]}
          />
        ))}
      </div>
    </div>
  );
};

// Menu Item Card Component
const MenuItemCard = ({ item, addToCart, isAdding }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex-shrink-0">
        <img
          src={item.imageUrl || "/placeholder-food.jpg"}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
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

            {item.rating > 0 && (
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                <span>{item.rating.toFixed(1)}</span>
                {item.totalReviews > 0 && (
                  <span className="ml-1">({item.totalReviews})</span>
                )}
              </div>
            )}

            {item.prepTime && (
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <Clock className="h-4 w-4 mr-1" />
                <span>{item.prepTime} mins</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => addToCart(item, quantity)}
            disabled={isAdding || !item.isAvailable}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAdding ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <ShoppingCart className="h-4 w-4 mr-2" />
            )}
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
