import React from "react";

const ProfilePanel = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6 mt-10">
      {/* 🧍 Profile Info */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold mb-2">🧍 Profile Info</h2>
        <p>Name: Ravi Kumar</p>
        <p>Email: ravi@example.com</p>
        <p>Phone: +91 9876543210</p>
        <p>Status: Available</p>
      </div>

      {/* 📦 Delivery History */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold mb-2">📦 Delivery History</h2>
        <ul className="list-disc ml-5">
          <li>Order to 12 Park Avenue - Delivered</li>
          <li>Order to 456 Jubilee Hills - Delivered</li>
        </ul>
      </div>

      {/* ⭐ Ratings & Feedback */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold mb-2">⭐ Ratings & Feedback</h2>
        <p>Rating: ★★★★☆ (4.5)</p>
        <p>Feedback: "Great delivery experience!"</p>
      </div>

      {/* ℹ️ About Us */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold mb-2">ℹ️ About Us</h2>
        <p>We connect hungry customers with delivery partners across the city.</p>
      </div>

      {/* ❓ Help & Support */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold mb-2">❓ Help & Support</h2>
        <p>Email: support@foodapp.com</p>
        <p>FAQs and help center available in the app.</p>
      </div>

      {/* 🔔 Notifications */}
      <div>
        <h2 className="text-xl font-bold mb-2">🔔 Notifications</h2>
        <ul className="list-disc ml-5">
          <li>New order available in Jubilee Hills</li>
          <li>System maintenance tonight at 11 PM</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfilePanel;
