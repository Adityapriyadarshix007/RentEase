import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const ProductCard = React.memo(({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  }, [addToCart, product]);

  const renderStars = useCallback((rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  }, []);

  // Get optimized thumbnail - add loading="lazy" for performance
  // Add this function inside ProductCard component
const getOptimizedImageUrl = (url) => {
  if (!url) return null;
  // If it's a Cloudinary URL, add optimization parameters
  if (url.includes('cloudinary.com')) {
    return url.replace('/upload/', '/upload/w_300,h_200,c_fill,q_auto,f_auto/');
  }
  return url;
};

// Then use it in the img src:
const optimizedUrl = getOptimizedImageUrl(thumbnailUrl);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <Link to={`/products/${product._id}`}>
        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden relative">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              decoding="async"
              width="300"
              height="200"
              onError={(e) => { 
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="%23999"%3E%3Crect x="2" y="2" width="20" height="20" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="2.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E';
              }}
            />
          ) : (
            <div className="text-6xl">🛋️</div>
          )}
          {/* Low stock badge */}
          {product.availableQuantity > 0 && product.availableQuantity <= 3 && (
            <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full z-10">
              Only {product.availableQuantity} left
            </span>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-blue-600 transition line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 mt-1">
          <div className="flex gap-0.5">{renderStars(product.rating || 0)}</div>
          <span className="text-xs text-gray-500">({product.numReviews || 0})</span>
        </div>
        
        {product.subCategory && (
          <p className="text-gray-500 text-sm mb-2 truncate">{product.subCategory}</p>
        )}
        
        <div className="flex justify-between items-center mt-3">
          <div>
            <span className="text-2xl font-bold text-blue-600">₹{product.monthlyRent}</span>
            <span className="text-gray-500 text-sm">/month</span>
          </div>
          <button 
            onClick={handleAddToCart} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer text-sm font-medium"
            aria-label={`Add ${product.name} to cart`}
          >
            Rent Now
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
