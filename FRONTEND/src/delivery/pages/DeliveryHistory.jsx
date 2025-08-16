import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DeliveryHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ Make sure it's stored with key "token"

        const res = await axios.get("http://localhost:9099/api/orders/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHistory(res.data);
      } catch (error) {
        console.error('❌ Failed to fetch delivery history:', error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-orange-600">📦 Delivery History</h1>
          <Link to="/dashboard" className="text-sm text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded">
            ← Back to Dashboard
          </Link>
        </div>

        {history.length === 0 ? (
          <p className="text-gray-500">No deliveries yet.</p>
        ) : (
          <div className="space-y-4">
            {history.map((order) => (
              <div key={order.id} className="bg-white shadow p-4 rounded-lg border-l-4 border-orange-500">
                <p><span className="font-semibold">Order ID:</span> {order.id}</p>
                <p><span className="font-semibold">Customer:</span> {order.customerName}</p>
                <p><span className="font-semibold">Phone:</span> {order.customerPhone}</p>
                <p><span className="font-semibold">Address:</span> {order.address}</p>
                <p><span className="font-semibold">Restaurant:</span> {order.restaurantName}</p>
                <p><span className="font-semibold">Delivered At:</span> {new Date(order.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryHistory;
