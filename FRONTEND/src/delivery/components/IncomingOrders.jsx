// src/components/IncomingOrders.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function IncomingOrders({ token, isAvailable, onToast }) {
  const [orders, setOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAvailable) return;

    const simulateOrders = async () => {
      try {
        await axios.post(
          "http://localhost:9099/api/orders/simulate",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("❌ Failed to simulate order", err);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:9099/api/orders/pending", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const now = Date.now();
        const freshOrders = res.data.filter((order) => {
          const orderTime = new Date(order.timestamp).getTime();
          return now - orderTime < 30 * 1000;
        });

        setOrders(freshOrders);
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
        setOrders([]);
      }
    };

    simulateOrders();
    fetchOrders();
    const intervalId = setInterval(() => {
      simulateOrders();
      fetchOrders();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [token, isAvailable]);

  const acceptOrder = async (orderId) => {
    try {
      await axios.post(
        `http://localhost:9099/api/orders/${orderId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const acceptedOrder = orders.find((o) => o.id === orderId);
      if (acceptedOrder) {
        setAcceptedOrders((prev) => [...prev, acceptedOrder]);
        onToast("✅ Order accepted");
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        navigate(`/delivery/orders/${orderId}/accepted`);
      }
    } catch (err) {
      console.error("❌ Failed to accept order:", err);
      onToast("❌ Failed to accept order");
    }
  };

  const rejectOrder = async (orderId) => {
    try {
      await axios.post(
        `http://localhost:9099/api/orders/${orderId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const rejectedOrder = orders.find((o) => o.id === orderId);
      if (rejectedOrder) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        onToast("❌ Order rejected");
      }
    } catch (err) {
      console.error("❌ Failed to reject order:", err);
      onToast("❌ Failed to reject order");
    }
  };

  if (!isAvailable) return null;

  return (
    <div className="mt-6 space-y-6 max-w-xl mx-auto bg-white bg-opacity-90 rounded p-4 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Incoming Orders</h3>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders right now.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border border-gray-300 p-4 rounded bg-white shadow-sm">
            <p><strong>Customer:</strong> {order.customerName}</p>
            <p><strong>Restaurant:</strong> {order.restaurantName}</p>
            <p><strong>Address:</strong> {order.address}</p>
            
            <p><strong>Items:</strong> {order.items.join(", ")}</p>
            <p><strong>Time:</strong> {new Date(order.timestamp).toLocaleString()}</p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => acceptOrder(order.id)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={() => rejectOrder(order.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
