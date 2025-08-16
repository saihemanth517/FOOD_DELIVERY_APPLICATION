// src/pages/AboutPage.jsx
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-orange-600 mb-4">About Us</h1>
        
        <p className="text-gray-700 mb-4">
          At <strong>SwiftEats</strong>, we believe that delivery partners are the heartbeat of our platform. We're not just a food delivery app — we're a company built on trust, speed, and opportunity.
        </p>

        <p className="text-gray-700 mb-4">
          Our platform empowers thousands of delivery professionals by offering flexible work, fair earnings, and real-time tools to manage deliveries efficiently. Whether you’re riding a bike, scooter, or car — you're a key part of bringing joy to our customers every day.
        </p>

        <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">Our Mission</h2>
        <p className="text-gray-700 mb-4">
          To create a reliable and rewarding environment for delivery partners while ensuring timely and quality service to customers.
        </p>

        <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">Why Partner with Us?</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li><strong>Flexible Hours:</strong> Work when it suits you — full-time or part-time.</li>
          <li><strong>Instant Order Notifications:</strong> Get real-time updates and optimized routes.</li>
          <li><strong>Fair Payouts:</strong> Transparent and on-time weekly payments.</li>
          <li><strong>Support & Training:</strong> We’re here to help you grow and succeed.</li>
          <li><strong>Recognition:</strong> Earn rewards and ratings for excellent performance.</li>
        </ul>

        <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">Join Our Network</h2>
        <p className="text-gray-700">
          We’re growing fast, and we want you to grow with us. Become a delivery partner and be part of something meaningful. Together, let’s make food delivery better, faster, and more reliable.
        </p>

        <div className="mt-6 text-center">
          <p className="text-orange-500 font-semibold">
            Ready to ride with us? Join the SwiftEats Delivery Partner team today!
          </p>
        </div>
      </div>
    </div>
  );
}
