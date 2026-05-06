import React, { useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaUser, FaThumbsUp, FaFlag, FaReply } from 'react-icons/fa';
import { formatDate, formatRelativeTime } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ProductReviews = ({ productId, reviews = [], averageRating = 0, totalReviews = 0 }) => {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(r => Math.floor(r.rating) === rating).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating, count, percentage };
  });

  const handleRatingClick = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }

    setSubmitting(true);
    try {
      // API call to submit review
      // await axios.post(`/api/products/${productId}/reviews`, newReview);
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      setNewReview({ rating: 5, title: '', comment: '' });
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, size = 'text-lg', interactive = false, onRatingClick = null, onHover = null) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (interactive) {
        stars.push(
          <button
            key={i}
            type="button"
            onClick={() => onRatingClick && onRatingClick(i)}
            onMouseEnter={() => onHover && onHover(i)}
            onMouseLeave={() => onHover && onHover(0)}
            className="focus:outline-none transform hover:scale-110 transition"
          >
            {i <= (hoverRating || newReview.rating) ? (
              <FaStar className={`${size} text-yellow-400`} />
            ) : (
              <FaRegStar className={`${size} text-gray-300`} />
            )}
          </button>
        );
      } else {
        if (i <= fullStars) {
          stars.push(<FaStar key={i} className={`${size} text-yellow-400`} />);
        } else if (i === fullStars + 1 && hasHalfStar) {
          stars.push(<FaStarHalfAlt key={i} className={`${size} text-yellow-400`} />);
        } else {
          stars.push(<FaRegStar key={i} className={`${size} text-gray-300`} />);
        }
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>
      
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b">
        {/* Average Rating */}
        <div className="text-center md:text-left">
          <div className="text-5xl font-bold text-primary">{averageRating.toFixed(1)}</div>
          <div className="flex justify-center md:justify-start mt-2">
            {renderStars(averageRating, 'text-2xl')}
          </div>
          <p className="text-gray-500 mt-2">Based on {totalReviews} reviews</p>
        </div>
        
        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-3">
              <div className="w-12 text-sm font-medium">{rating} stars</div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-12 text-sm text-gray-500">{count}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Write Review Button */}
      {!showReviewForm && (
        <div className="mb-8">
          <button
            onClick={() => setShowReviewForm(true)}
            className="btn-primary"
          >
            Write a Review
          </button>
        </div>
      )}
      
      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h4 className="text-xl font-semibold mb-4">Write Your Review</h4>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Your Rating *</label>
              <div className="flex gap-1">
                {renderStars(newReview.rating, 'text-2xl', true, handleRatingClick, setHoverRating)}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Review Title *</label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                className="input"
                placeholder="Summarize your experience"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Your Review *</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="input"
                rows="4"
                placeholder="Share your experience with this product"
                required
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No reviews yet. Be the first to review this product!
          </div>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="border-b pb-6 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                    <FaUser />
                  </div>
                  <div>
                    <p className="font-semibold">{review.user?.name || 'Anonymous'}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(review.rating, 'text-sm')}</div>
                      <span className="text-xs text-gray-500">{formatRelativeTime(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-gray-400 hover:text-primary transition">
                    <FaThumbsUp size={14} />
                  </button>
                  <button className="text-gray-400 hover:text-red-500 transition">
                    <FaFlag size={14} />
                  </button>
                </div>
              </div>
              
              <h4 className="font-semibold text-gray-800 mt-2">{review.title}</h4>
              <p className="text-gray-600 mt-1">{review.comment}</p>
              
              {review.reply && (
                <div className="mt-3 ml-6 pl-4 border-l-2 border-primary">
                  <div className="flex items-center gap-2 text-sm text-primary mb-1">
                    <FaReply />
                    <span className="font-medium">Seller Response</span>
                  </div>
                  <p className="text-gray-600 text-sm">{review.reply}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(review.replyDate)}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;