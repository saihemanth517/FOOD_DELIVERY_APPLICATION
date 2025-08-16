import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ResOwnerOrders = ({ restaurantId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!restaurantId) return;
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:9090/api/orders/restaurant/${restaurantId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [restaurantId]);

  const handleStatusChange = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:9090/api/orders/${orderId}/status`, { status }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setOrders(orders => orders.map(order => order.id === orderId ? { ...order, status } : order));
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  if (!restaurantId) return <div className="text-gray-500">No restaurant found.</div>;
  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Orders</h2>
      {orders.length === 0 ? (
        <div className="text-gray-500">No orders found.</div>
      ) : (
        <ul className="space-y-4">
          {orders.map(order => (
            <li key={order.id} className="border p-4 rounded-md flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div><span className="font-semibold">Order ID:</span> {order.id}</div>
                <div><span className="font-semibold">Customer:</span> {order.customerName}</div>
                <div><span className="font-semibold">Items:</span> {order.items.map(i => i.name).join(', ')}</div>
                <div><span className="font-semibold">Total:</span> ₹{order.totalAmount}</div>
                <div><span className="font-semibold">Status:</span> <span className="font-bold text-indigo-600">{order.status}</span></div>
              </div>
              <div className="mt-2 md:mt-0 flex space-x-2">
                {order.status === 'PENDING' && (
                  <>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                      onClick={() => handleStatusChange(order.id, 'ACCEPTED')}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                      onClick={() => handleStatusChange(order.id, 'REJECTED')}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResOwnerOrders;
