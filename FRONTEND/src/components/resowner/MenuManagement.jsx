import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MenuManagement = ({ restaurantId }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    imageUrl: '',
    isAvailable: true,
  });

  useEffect(() => {
    fetchMenuItems();
  }, [restaurantId]);

  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('DEBUG: restaurantId =', restaurantId);
      console.log('DEBUG: token =', token);
      if (!token) {
        alert('Please login first');
        return;
      }
      if (!restaurantId) {
        alert('No restaurant found. Please add your restaurant first.');
        return;
      }
      const url = `http://localhost:9090/api/menu-items/restaurant/${restaurantId}`;
      console.log('DEBUG: Fetching menu items from', url);
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        alert('Access denied. Please check your permissions.');
      } else {
        alert('Error fetching menu items: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
      imageUrl: item.imageUrl || '',
      isAvailable: item.isAvailable,
    });
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        return;
      }

      await axios.delete(`http://localhost:9090/api/menu-items/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchMenuItems();
      alert('Menu item deleted successfully!');
    } catch (error) {
      console.error('Error deleting menu item:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        alert('Access denied. Please check your permissions.');
      } else {
        alert('Error deleting menu item: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      if (editingItem) {
        await axios.put(`http://localhost:9090/api/menu-items/${editingItem.id}`, formData, {
          headers
        });
        alert('Menu item updated successfully!');
      } else {
        await axios.post(`http://localhost:9090/api/menu-items/restaurant/${restaurantId}`, formData, {
          headers
        });
        alert('Menu item added successfully!');
      }
      
      setEditingItem(null);
      setFormData({
        name: '',
        price: '',
        description: '',
        category: '',
        imageUrl: '',
        isAvailable: true,
      });
      fetchMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        alert('Access denied. Please check your permissions.');
      } else {
        alert('Error saving menu item: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      imageUrl: '',
      isAvailable: true,
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Menu Management</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
            id="isAvailable"
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
            Available
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          {editingItem && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {editingItem ? 'Update' : 'Add'} Menu Item
          </button>
        </div>
      </form>

      <div>
        <h3 className="text-xl font-semibold mb-4">Menu Items</h3>
        {menuItems.length === 0 ? (
          <p>No menu items found.</p>
        ) : (
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.id} className="border p-4 rounded-md flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-bold">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sm font-semibold">${item.price}</p>
                  <p className="text-sm italic">{item.category}</p>
                  {!item.isAvailable && <p className="text-red-600 font-semibold">Out of Stock</p>}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
