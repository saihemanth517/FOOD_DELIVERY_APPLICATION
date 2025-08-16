import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Star, Plus, Calendar, MessageSquare, Truck, ChefHat } from "lucide-react";
import axios from "axios";

const ReviewList = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveredOrders, setDeliveredOrders] = useState([]);

  useEffect(() => {
    fetchMyReviews();
    fetchDeliveredOrders();
    
    if (orderId) {
      setShowReviewForm(true);
      fetchOrderForReview(orderId);
    }
  }, [orderId]);

  const fetchMyReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await axios.get("http://localhost:9090/customer/reviews", { headers });
      setReviews(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    }
  };

  const fetchDeliveredOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await axios.get("http://localhost:9090/customer/orders", { headers });
      const delivered = response.data.filter(order => 
        order.status === "DELIVERED" && order.canReview && !order.hasReviewed
      );
      setDeliveredOrders(delivered);
    } catch (error) {
      console.error("Error fetching delivered orders:", error);
    }
  };

  const fetchOrderForReview = async (orderIdParam) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await axios.get(`http://localhost:9090/customer/orders/${orderIdParam}`, { headers });
      if (response.data.status === "DELIVERED" && response.data.canReview && !response.data.hasReviewed) {
        setSelectedOrder(response.data);
      }
    } catch (error) {
      console.error("Error fetching order for review:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const getReviewTypeIcon = (type) => {
    switch (type) {
      case "RESTAURANT":
        return <ChefHat className="h-5 w-5 text-orange-500" />;
      case "DELIVERY_PARTNER":
        return <Truck className="h-5 w-5 text-blue-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
          <p className="text-gray-600 mt-1">Share your experience and help others</p>
        </div>
        <button
          onClick={() => setShowReviewForm(true)}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Write Review
        </button>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          order={selectedOrder}
          deliveredOrders={deliveredOrders}
          onClose={() => {
            setShowReviewForm(false);
            setSelectedOrder(null);
          }}
          onSuccess={() => {
            setShowReviewForm(false);
            setSelectedOrder(null);
            fetchMyReviews();
            fetchDeliveredOrders();
          }}
        />
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No reviews yet</h2>
          <p className="text-gray-600 mb-6">Start by reviewing your delivered orders</p>
          {deliveredOrders.length > 0 && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Write Your First Review
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} renderStars={renderStars} getReviewTypeIcon={getReviewTypeIcon} formatDate={formatDate} />
          ))}
        </div>
      )}
    </div>
  );
};

// Review Card Component
const ReviewCard = ({ review, renderStars, getReviewTypeIcon, formatDate }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getReviewTypeIcon(review.reviewType)}
          <div>
            <h3 className="font-semibold text-gray-900">
              {review.restaurantName || review.deliveryPartnerName}
            </h3>
            <p className="text-sm text-gray-600">Order #{review.orderNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 mb-1">
            {renderStars(review.rating)}
          </div>
          <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
        </div>
      </div>

      {review.comment && (
        <p className="text-gray-700 mb-4">{review.comment}</p>
      )}

      {/* Detailed Ratings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        {review.foodRating && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Food Quality</span>
            <div className="flex items-center gap-1">
              {renderStars(review.foodRating)}
            </div>
          </div>
        )}
        {review.serviceRating && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Service</span>
            <div className="flex items-center gap-1">
              {renderStars(review.serviceRating)}
            </div>
          </div>
        )}
        {review.deliveryRating && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Delivery</span>
            <div className="flex items-center gap-1">
              {renderStars(review.deliveryRating)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Review Form Component
const ReviewForm = ({ order, deliveredOrders, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    orderId: order?.id || "",
    rating: 5,
    comment: "",
    reviewType: "RESTAURANT",
    foodRating: 5,
    serviceRating: 5,
    deliveryRating: 5,
    isAnonymous: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.orderId) {
      newErrors.orderId = "Please select an order to review";
    }

    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Please provide a rating between 1 and 5";
    }

    if (!formData.comment.trim()) {
      newErrors.comment = "Please write a comment";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitReview = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await axios.post(
        "http://localhost:9090/customer/reviews",
        formData,
        { headers }
      );

      if (response.data.success) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to submit review. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarRating = (value, onChange) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                star <= value ? "text-yellow-400 fill-current" : "text-gray-300"
              } hover:text-yellow-400 transition-colors`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <Plus className="h-6 w-6 rotate-45" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Order Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Order
              </label>
              <select
                value={formData.orderId}
                onChange={(e) => handleInputChange("orderId", e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.orderId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Choose an order to review</option>
                {deliveredOrders.map((order) => (
                  <option key={order.id} value={order.id}>
                    Order #{order.orderNumber} - {order.restaurantName}
                  </option>
                ))}
              </select>
              {errors.orderId && (
                <p className="text-red-500 text-sm mt-1">{errors.orderId}</p>
              )}
            </div>

            {/* Review Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="reviewType"
                    value="RESTAURANT"
                    checked={formData.reviewType === "RESTAURANT"}
                    onChange={(e) => handleInputChange("reviewType", e.target.value)}
                    className="mr-2"
                  />
                  Restaurant
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="reviewType"
                    value="DELIVERY_PARTNER"
                    checked={formData.reviewType === "DELIVERY_PARTNER"}
                    onChange={(e) => handleInputChange("reviewType", e.target.value)}
                    className="mr-2"
                  />
                  Delivery Partner
                </label>
              </div>
            </div>

            {/* Overall Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating
              </label>
              {renderStarRating(formData.rating, (rating) => handleInputChange("rating", rating))}
              {errors.rating && (
                <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
              )}
            </div>

            {/* Detailed Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Quality
                </label>
                {renderStarRating(formData.foodRating, (rating) => handleInputChange("foodRating", rating))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service
                </label>
                {renderStarRating(formData.serviceRating, (rating) => handleInputChange("serviceRating", rating))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery
                </label>
                {renderStarRating(formData.deliveryRating, (rating) => handleInputChange("deliveryRating", rating))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => handleInputChange("comment", e.target.value)}
                placeholder="Share your experience..."
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${
                  errors.comment ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.comment && (
                <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
              )}
            </div>

            {/* Anonymous Option */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => handleInputChange("isAnonymous", e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Post anonymously</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
