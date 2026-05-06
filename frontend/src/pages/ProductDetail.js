import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaStarHalfAlt, FaRegStar, FaTruck, FaShieldAlt, FaCalendarAlt, FaRupeeSign, FaPlus, FaMinus, FaCheckCircle, FaChevronLeft, FaChevronRight, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTenure, setSelectedTenure] = useState(3);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/products/${id}`);
      const data = await response.json();
      setProduct(data.product || data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    addToCart(product, selectedTenure, quantity);
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    addToCart(product, selectedTenure, quantity);
    navigate('/cart');
  };

  const nextImage = () => {
    if (product?.images && product.images.length > 0) {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 0) {
      setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  // Function to render stars for rating display
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
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
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) return null;

  const totalRent = product.monthlyRent * selectedTenure * quantity;
  const totalPayable = totalRent + (product.securityDeposit || 0);
  const isInStock = product.availableQuantity > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/products')}
        className="text-blue-600 hover:text-blue-800 mb-6 inline-flex items-center gap-2 cursor-pointer"
      >
        ← Back to Products
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div>
          <div className="bg-gray-100 rounded-lg p-4 mb-4 relative group">
            <div className="h-96 flex items-center justify-center">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=Product';
                  }}
                />
              ) : (
                <div className="text-center">
                  <div className="text-6xl mb-4">🛋️</div>
                  <p className="text-gray-400">No image available</p>
                </div>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition"
                >
                  <FaChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition"
                >
                  <FaChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 justify-center">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-lg border-2 overflow-hidden flex-shrink-0 transition ${
                    selectedImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-600/50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} ${idx + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info Section */}
        <div>
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
              {product.category} / {product.subCategory}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
          
          {/* Ratings Section */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-1">
              {renderStars(product.rating || 0)}
            </div>
            <span className="text-gray-500 text-sm">
              {product.numReviews || 0} Verified Reviews
            </span>
            {isInStock ? (
              <span className="text-green-600 text-sm flex items-center gap-1">
                <FaCheckCircle size={12} /> In Stock
              </span>
            ) : (
              <span className="text-red-500 text-sm">Out of Stock</span>
            )}
          </div>
          
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-blue-600">₹{product.monthlyRent}</span>
              <span className="text-gray-500">/month</span>
            </div>
            <div className="text-gray-500 text-sm mt-1">
              Security Deposit: <span className="font-semibold">₹{product.securityDeposit || 0}</span>
            </div>
          </div>
          
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
          
          <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm"><FaTruck className="text-blue-600" /> Free Delivery</div>
            <div className="flex items-center gap-2 text-sm"><FaShieldAlt className="text-blue-600" /> Secure Deposit</div>
            <div className="flex items-center gap-2 text-sm"><FaCalendarAlt className="text-blue-600" /> Flexible Tenure</div>
            <div className="flex items-center gap-2 text-sm"><FaRupeeSign className="text-blue-600" /> Best Price</div>
          </div>
          
          {/* Rental Tenure Selection */}
          <div className="mb-6">
            <label className="block font-medium mb-3">Select Rental Tenure</label>
            <div className="flex flex-wrap gap-3">
              {(product.rentalTenureOptions || [1, 3, 6, 12]).map(tenure => (
                <button
                  key={tenure}
                  onClick={() => setSelectedTenure(tenure)}
                  className={`px-5 py-2 rounded-lg border-2 transition ${
                    selectedTenure === tenure
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-blue-600'
                  }`}
                >
                  {tenure} {tenure === 1 ? 'Month' : 'Months'}
                </button>
              ))}
            </div>
          </div>
          
          {/* Quantity Selection */}
          <div className="mb-6">
            <label className="block font-medium mb-3">Quantity</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-blue-600 transition"
              >
                <FaMinus />
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.availableQuantity, quantity + 1))}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-blue-600 transition"
              >
                <FaPlus />
              </button>
              <span className="text-sm text-gray-500">{product.availableQuantity} available</span>
            </div>
          </div>
          
          {/* Price Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3">Price Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Rent</span>
                <span>₹{product.monthlyRent} × {selectedTenure} months × {quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Rent</span>
                <span className="font-semibold">₹{totalRent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Security Deposit</span>
                <span>₹{product.securityDeposit || 0}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total Payable</span>
                  <span className="text-blue-600 text-lg">₹{totalPayable}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">*Security deposit refundable after inspection</p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition disabled:opacity-50"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!isInStock}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              Rent Now
            </button>
          </div>
        </div>
      </div>
      
      {/* Tabs Section */}
      <div className="mt-12">
        <div className="border-b flex gap-8 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 font-medium transition ${
              activeTab === 'details' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Product Details
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`pb-3 font-medium transition ${
              activeTab === 'specifications' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 font-medium transition ${
              activeTab === 'reviews' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Reviews ({product.numReviews || 0})
          </button>
        </div>
        
        <div className="bg-white rounded-lg p-6">
          {activeTab === 'details' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Product Details</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}
          
          {activeTab === 'specifications' && product.specifications && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex py-2 border-b">
                      <span className="w-1/2 font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="w-1/2 text-gray-600">{value}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600">{product.rating || 0}</div>
                  <div className="flex gap-1 mt-2">{renderStars(product.rating || 0)}</div>
                  <div className="text-sm text-gray-500 mt-1">{product.numReviews || 0} ratings</div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-600">Based on {product.numReviews || 0} customer reviews</p>
                  <p className="text-sm text-gray-500 mt-1">Be the first to review this product!</p>
                </div>
              </div>
              
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map((review, idx) => (
                    <div key={idx} className="border-b pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <FaUser className="text-gray-500" />
                        </div>
                        <div>
                          <p className="font-semibold">{review.user?.name || 'Anonymous'}</p>
                          <div className="flex gap-1">{renderStars(review.rating)}</div>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
