// src/pages/HelpSupportPage.jsx
export default function HelpSupportPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-orange-600 mb-4">Help & Support</h1>
        
        <p className="text-gray-700 mb-4">
          We're here to help! Whether you have questions about using the app, your deliveries, or payments, you can find answers or reach out to us.
        </p>

        <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">Frequently Asked Questions (FAQs)</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li><strong>How do I update my availability?</strong> You can toggle your availability on the dashboard anytime.</li>
          <li><strong>What happens if I can't complete a delivery?</strong> Contact support immediately so we can assist you.</li>
          <li><strong>When do I get paid?</strong> Payments are processed weekly to your registered account.</li>
          <li><strong>How do I report an issue with the app?</strong> Use the contact form below or email support.</li>
        </ul>

        <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">Contact Support</h2>
        <p className="text-gray-700 mb-4">
          If you need further assistance, please reach out to us:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Email: <a href="mailto:support@swifteats.com" className="text-orange-600 hover:underline">support@swifteats.com</a></li>
          <li>Phone: <a href="tel:+18001234567" className="text-orange-600 hover:underline">+1 800 123 4567</a></li>
          <li>Support Hours: Mon - Fri, 9 AM - 6 PM</li>
        </ul>

        <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">Feedback</h2>
        <p className="text-gray-700 mb-4">
          Your feedback helps us improve! Please send any comments or suggestions to our email.
        </p>
      </div>
    </div>
  );
}
