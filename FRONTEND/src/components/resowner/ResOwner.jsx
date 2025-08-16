import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantForm from './RestaurantForm';
import MenuManagement from './MenuManagement';
import MenuPreview from './MenuPreview';
import axios from 'axios';
import ResOwnerOrders from './ResOwnerOrders';

const ResOwner = () => {
  const [restaurantId, setRestaurantId] = useState(null);
  const [activeTab, setActiveTab] = useState('restaurant');
  const [restaurantData, setRestaurantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  // Move fetchRestaurantData outside useEffect so it can be called after save
  const fetchRestaurantData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await axios.get('http://localhost:9090/api/restaurants/owner', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data && response.data.length > 0) {
        setRestaurantData(response.data[0]);
        setRestaurantId(response.data[0].id);
      } else {
        setRestaurantData(null);
        setRestaurantId(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantData();
    // eslint-disable-next-line
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Management Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('restaurant')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'restaurant'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Restaurant Info
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'menu'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Menu Management
              </button>
              <button
                onClick={() => setActiveTab('view')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'view'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                View Menu
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Orders
              </button>
            </nav>
            {activeTab === 'orders' && (
              <div>
                <ResOwnerOrders restaurantId={restaurantId} />
              </div>
            )}
          </div>

          <div className="p-6">

            {activeTab === 'restaurant' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Restaurant Information</h2>
                <RestaurantForm 
                  restaurant={restaurantData}
                  onSave={() => {
                    alert('Restaurant saved successfully!');
                    fetchRestaurantData(); // Refresh after save
                  }}
                  onCancel={() => setActiveTab('menu')}
                />
              </div>
            )}

            {activeTab === 'menu' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Menu Management</h2>
                <MenuManagement restaurantId={restaurantId} />
              </div>
            )}

            {activeTab === 'view' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Menu Preview</h2>
                <MenuPreview restaurantId={restaurantId} />
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Orders</h2>
                <ResOwnerOrders restaurantId={restaurantId} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResOwner;
