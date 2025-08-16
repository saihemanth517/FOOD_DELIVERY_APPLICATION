// src/pages/FeedbackPage.jsx
import React, { useState } from 'react';
import axios from 'axios';

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    orderId: '',
    rating: '5', // Default to 5 Stars as per the image
    comments: '',
  });

  const [status, setStatus] = useState({ success: null, message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setStatus({ success: false, message: 'Not authenticated. Please log in.' });
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:9099/api/feedback',
        {
          orderId: formData.orderId,
          rating: parseInt(formData.rating),
          comments: formData.comments,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatus({ success: true, message: '✅ Feedback submitted successfully!' });
      setFormData({ orderId: '', rating: '5', comments: '' }); // Reset rating to 5 after submission
    } catch (err) {
      console.error('❌ Error:', err);
      setStatus({ success: false, message: '❌ Failed to submit feedback.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">Ratings & Feedback</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="orderId" className="block text-gray-700 font-medium mb-1">Order ID</label>
            <input
              type="text"
              id="orderId"
              name="orderId"
              value={formData.orderId}
              onChange={handleChange}
              placeholder="Enter Order ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label htmlFor="rating" className="block text-gray-700 font-medium mb-1">Rating (1 to 5) *</label>
            <div className="relative">
              <select
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="comments" className="block text-gray-700 font-medium mb-1">Feedback</label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Write your feedback here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 h-28 resize-none"
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-md font-semibold transition duration-200"
          >
            Submit Feedback
          </button>

          {status.message && (
            <div
              className={`text-center mt-3 font-medium ${
                status.success ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {status.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;