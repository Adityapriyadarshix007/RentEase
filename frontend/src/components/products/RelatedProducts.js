import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const RelatedProducts = ({ products = [], currentProductId, title = "Related Products" }) => {
  const { addToCart } = useCart();
  
  // Filter out current product and limit to 4
  const relatedProducts = products
    .filter(p => p._id !== currentProductId)
    .slice(0, 4);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">{title}</h3>
        <Link to="/products" className="text-primary hover:underline">
          View All →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map(product => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group">
            <Link to={`/products/${product._id}`}>
              <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                {product.images?.[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                ) : (
                  <div className="text-5xl">🛋️</div>
                )}
              </div>
            </Link>
            
            <div className="p-4">
              <Link to={`/products/${product._id}`}>
                <h4 className="font-semibold text-gray-800 hover:text-primary transition line-clamp-1">
                  {product.name}
                </h4>
              </Link>
              
              <p className="text-sm text-gray-500 mt-1">{product.subCategory}</p>
              
              <div className="flex items-center mt-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'} size={12} />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-2">({product.numReviews || 0})</span>
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <div>
                  <span className="text-xl font-bold text-primary">₹{product.monthlyRent}</span>
                  <span className="text-xs text-gray-500">/month</span>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="p-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
                  disabled={product.availableQuantity === 0}
                >
                  <FaShoppingCart size={16} />
                </button>
              </div>
              
              {product.availableQuantity === 0 && (
                <p className="text-xs text-red-500 mt-2">Out of Stock</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;