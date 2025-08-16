import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjdlYjkyODAzN2JkMzQwNjg4OTEzMWJjNmM2ODI4ODA5IiwiaCI6Im11cm11cjY0In0="; 

function AcceptedOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const token = localStorage.getItem("token");

  
  const locations = [
    {
      restaurant: [78.486671, 17.385044],
      customer: [78.444378, 17.412352],
    },
    {
      restaurant: [78.489046, 17.406239],
      customer: [78.456783, 17.421321],
    },
    {
      restaurant: [78.480230, 17.400099],
      customer: [78.451122, 17.430908],
    },
  ];

  const getDistanceTime = async (restaurantLng, restaurantLat, customerLng, customerLat) => {
    try {
      const res = await axios.get(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${restaurantLng},${restaurantLat}&end=${customerLng},${customerLat}`
      );
      const route = res.data.features[0].properties.segments[0];
      setDistance((route.distance / 1000).toFixed(2) + " km");
      setDuration(Math.round(route.duration / 60) + " mins");
    } catch (err) {
      console.error("Distance API error", err);
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:9099/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrder(res.data);
        setStatus(res.data.status);

        // Pick a random route from mock data
        const random = locations[Math.floor(Math.random() * locations.length)];
        getDistanceTime(
          random.restaurant[0],
          random.restaurant[1],
          random.customer[0],
          random.customer[1]
        );
      })
      .catch((err) => console.error("Error fetching order:", err));
  }, [id]);

  const updateStatus = (newStatus) => {
    axios
      .post(
        `http://localhost:9099/api/orders/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => setStatus(newStatus))
      .catch((err) => console.error("Status update failed:", err));
  };

  if (!order) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xl w-full space-y-6">
        <h2 className="text-3xl font-bold text-green-600 text-center">Order Accepted!</h2>

        <div className="space-y-2 text-gray-800 text-lg">
          <p><span className="font-semibold">ID:</span> {order.id}</p>
          <p><span className="font-semibold">Customer:</span> {order.customerName}</p>
          <p>
            <span className="font-semibold">Phone:</span>{" "}
            <a href={`tel:${order.customerPhone}`} className="text-blue-600 underline">
              {order.customerPhone}
            </a>
          </p>
          <p><span className="font-semibold">Address:</span> {order.address}</p>
          <p><span className="font-semibold">Current Status:</span>{" "}
            <span className={`font-bold ${
              status === "ACCEPTED" ? "text-yellow-600"
              : status === "PICKED_UP" ? "text-blue-600"
              : "text-green-700"}`}>
              {status}
            </span>
          </p>
          <p><span className="font-semibold">Distance:</span> {distance}</p>
          <p><span className="font-semibold">Estimated Time:</span> {duration}</p>
        </div>

        <div className="mt-4">
          <iframe
            title="Customer Map"
            className="w-full h-64 rounded-lg shadow"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${encodeURIComponent(order.address)}&output=embed`}
          ></iframe>
        </div>

        <div className="flex flex-col gap-3 items-center mt-6">
          {status === "ACCEPTED" && (
            <button
              onClick={() => updateStatus("PICKED_UP")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-2 rounded-full transition"
            >
              Mark as Picked Up
            </button>
          )}
          {status === "PICKED_UP" && (
            <button
              onClick={() => updateStatus("DELIVERED")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-full transition"
            >
              Mark as Delivered
            </button>
          )}
          {status === "DELIVERED" && (
            <p className="text-green-700 font-semibold text-xl">✅ Order Delivered</p>
          )}
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 text-sm text-gray-600 hover:underline"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default AcceptedOrderPage;
