import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-sm" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300 text-sm" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group">
      <Link to={`/products/${product._id}`}>
        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=Product';
              }}
            />
          ) : (
            <div className="text-6xl">🛋️</div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-blue-600 transition line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        {/* Ratings Section - NEW */}
        <div className="flex items-center gap-2 mt-1">
          <div className="flex gap-0.5">
            {renderStars(product.rating || 0)}
          </div>
          <span className="text-xs text-gray-500">({product.numReviews || 0} reviews)</span>
        </div>
        
        <p className="text-gray-500 text-sm mb-2">{product.subCategory}</p>
        
        <div className="flex justify-between items-center mt-3">
          <div>
            <span className="text-2xl font-bold text-blue-600">₹{product.monthlyRent}</span>
            <span className="text-gray-500 text-sm">/month</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Rent Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
