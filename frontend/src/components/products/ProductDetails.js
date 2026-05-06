import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar, FaTruck, FaShieldAlt, FaCalendarAlt, FaRupeeSign, FaPlus, FaMinus, FaHeart, FaRegHeart, FaShare, FaCheckCircle } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/api';
import ProductReviews from './ProductReviews';
import RelatedProducts from './RelatedProducts';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTenure, setSelectedTenure] = useState(3);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('details'); // details, specifications, reviews

  useEffect(() => {
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await productService.getProductById(id);
      setProduct(response.data.product);
      fetchRelatedProducts(response.data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (currentProduct) => {
    try {
      const response = await productService.getProducts({
        category: currentProduct.category,
        subCategory: currentProduct.subCategory,
        limit: 5
      });
      setRelatedProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching related products:', error);
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

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.availableQuantity || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

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
      <div className="container-custom py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 w-3/4 rounded"></div>
              <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
              <div className="bg-gray-200 h-12 w-1/3 rounded"></div>
              <div className="bg-gray-200 h-24 rounded"></div>
              <div className="bg-gray-200 h-10 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const totalRent = product.monthlyRent * selectedTenure * quantity;
  const totalPayable = totalRent + product.securityDeposit;
  const isInStock = product.availableQuantity > 0;

  return (
    <div className="container-custom py-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-primary">Home</a>
        <span>/</span>
        <a href="/products" className="hover:text-primary">Products</a>
        <span>/</span>
        <a href={`/products?category=${product.category}`} className="hover:text-primary">{product.category}</a>
        <span>/</span>
        <span className="text-gray-800">{product.name}</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 mb-4">
            <div className="h-96 flex items-center justify-center">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <div className="text-8xl mb-4">🛋️</div>
                  <p className="text-gray-400">No image available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg border-2 overflow-hidden flex-shrink-0 transition ${
                    selectedImage === idx ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info Section */}
        <div>
          {/* Category Badge */}
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-blue-100 text-primary text-sm rounded-full">
              {product.category} / {product.subCategory}
            </span>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-1">
              {renderStars(product.rating || 0)}
            </div>
            <span className="text-gray-500 text-sm">
              {product.numReviews || 0} reviews
            </span>
            {isInStock ? (
              <span className="text-green-600 text-sm flex items-center gap-1">
                <FaCheckCircle size={12} /> In Stock
              </span>
            ) : (
              <span className="text-red-500 text-sm">Out of Stock</span>
            )}
          </div>
          
          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">₹{product.monthlyRent}</span>
              <span className="text-gray-500">/month</span>
            </div>
            <div className="text-gray-500 text-sm mt-1">
              Security Deposit: <span className="font-semibold">₹{product.securityDeposit}</span>
            </div>
          </div>
          
          {/* Description Preview */}
          <div className="mb-6">
            <p className="text-gray-600">
              {showFullDescription ? product.description : `${product.description.substring(0, 200)}...`}
              {product.description.length > 200 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-primary ml-2 hover:underline"
                >
                  {showFullDescription ? 'Show less' : 'Read more'}
                </button>
              )}
            </p>
          </div>
          
          {/* Key Features */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaTruck className="text-primary" />
              <span>Free Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaShieldAlt className="text-primary" />
              <span>Secure Deposit</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaCalendarAlt className="text-primary" />
              <span>Flexible Tenure</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaRupeeSign className="text-primary" />
              <span>Best Price Guarantee</span>
            </div>
          </div>
          
          {/* Rental Tenure Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3">Select Rental Tenure</label>
            <div className="flex flex-wrap gap-3">
              {product.rentalTenureOptions?.map(tenure => (
                <button
                  key={tenure}
                  onClick={() => setSelectedTenure(tenure)}
                  className={`px-5 py-2 rounded-lg border-2 transition transform hover:scale-105 ${
                    selectedTenure === tenure
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 text-gray-700 hover:border-primary'
                  }`}
                >
                  {tenure} {tenure === 1 ? 'Month' : 'Months'}
                </button>
              ))}
            </div>
          </div>
          
          {/* Quantity Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <FaMinus />
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.availableQuantity}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <FaPlus />
              </button>
              <span className="text-sm text-gray-500">
                {product.availableQuantity} available
              </span>
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
                <span>₹{product.securityDeposit}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total Payable</span>
                  <span className="text-primary text-lg">₹{totalPayable}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  *Security deposit refundable after return inspection
                </p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className="flex-1 btn-outline py-3 disabled:opacity-50"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!isInStock}
              className="flex-1 btn-primary py-3 disabled:opacity-50"
            >
              Rent Now
            </button>
            <button
              onClick={handleWishlist}
              className="p-3 border rounded-lg hover:border-primary transition"
            >
              {isWishlisted ? <FaHeart className="text-red-500" size={20} /> : <FaRegHeart size={20} />}
            </button>
            <button
              onClick={handleShare}
              className="p-3 border rounded-lg hover:border-primary transition"
            >
              <FaShare size={20} />
            </button>
          </div>
          
          {/* Estimated Delivery */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <FaCheckCircle />
              <span className="text-sm">Estimated delivery within 3-5 business days</span>
            </div>
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
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Product Details
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`pb-3 font-medium transition ${
              activeTab === 'specifications' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 font-medium transition ${
              activeTab === 'reviews' 
                ? 'border-b-2 border-primary text-primary' 
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
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Key Features</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>High-quality materials for durability</li>
                  <li>Modern design that complements any space</li>
                  <li>Easy to maintain and clean</li>
                  <li>Eco-friendly and sustainable materials</li>
                  <li>Warranty included for manufacturing defects</li>
                </ul>
              </div>
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
            <ProductReviews 
              productId={product._id}
              reviews={product.reviews || []}
              averageRating={product.rating || 0}
              totalReviews={product.numReviews || 0}
            />
          )}
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <RelatedProducts 
          products={relatedProducts}
          currentProductId={product._id}
          title="You May Also Like"
        />
      )}
    </div>
  );
};

export default ProductDetails;