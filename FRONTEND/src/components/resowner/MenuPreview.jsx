import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MenuPreview = ({ restaurantId }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (restaurantId) {
      fetchMenuItems();
    }
  }, [restaurantId]);

  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view menu items');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:9090/api/menu-items/restaurant/${restaurantId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setMenuItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError('Failed to load menu items');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Menu Preview</h2>
      {menuItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No menu items found for this restaurant.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder.svg';
                  }}
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <p className="text-sm text-gray-500 mb-2">Category: {item.category}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-bold text-indigo-600">₹{item.price}</span>
                  <span className={`text-sm px-2 py-1 rounded ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.isAvailable ? 'Available' : 'Out of Stock'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 mb-2">
                  {item.spiceLevel && <div><b>Spice:</b> {item.spiceLevel}</div>}
                  {item.calories && <div><b>Calories:</b> {item.calories}</div>}
                  {item.prepTime && <div><b>Prep Time:</b> {item.prepTime} min</div>}
                  {item.rating && <div><b>Rating:</b> {item.rating} ⭐</div>}
                  {item.totalReviews && <div><b>Reviews:</b> {item.totalReviews}</div>}
                  {item.isVegan && <div className="text-green-700"><b>Vegan</b></div>}
                  {item.isVegetarian && <div className="text-green-700"><b>Vegetarian</b></div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPreview;
