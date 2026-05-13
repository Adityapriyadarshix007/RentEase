import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaStarHalfAlt, FaRegStar, FaTruck, FaShieldAlt, FaCalendarAlt, FaRupeeSign, FaPlus, FaMinus, FaCheckCircle, FaChevronLeft, FaChevronRight, FaUser, FaThumbsUp, FaThumbsDown, FaShare, FaHeart, FaRegHeart, FaClipboardList, FaBox, FaCouch, FaWrench, FaBolt, FaWater, FaTemperatureHigh } from 'react-icons/fa';
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
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://rentease-backend-njvk.onrender.com';

  useEffect(() => {
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        const productData = data.product || data;
        if (productData && productData._id) {
          setProduct(productData);
        } else {
          toast.error('Product not found');
          navigate('/products');
        }
      } else {
        toast.error(data.message || 'Product not found');
        navigate('/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product. Please try again.');
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
    if (!product) return;
    
    addToCart(product, selectedTenure, quantity);
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    if (!product) return;
    
    addToCart(product, selectedTenure, quantity);
    navigate('/cart');
  };

  const handleSubmitReview = async () => {
    if (!reviewData.comment.trim()) {
      toast.error('Please write a review');
      return;
    }
    
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: reviewData.rating,
          comment: reviewData.comment
        })
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('Review submitted successfully!');
        setShowReviewForm(false);
        setReviewData({ rating: 5, comment: '' });
        fetchProduct(); // Refresh product data
      } else {
        toast.error(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Review error:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
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

  const renderStars = (rating) => {
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
  };

  // Generate technical specifications based on product category
  const getTechnicalSpecs = () => {
    const category = product?.category?.toLowerCase() || '';
    
    if (category.includes('furniture') || category.includes('bed') || category.includes('sofa') || category.includes('table') || category.includes('chair') || category.includes('wardrobe')) {
      return [
        { label: 'Material', value: 'Premium Engineered Wood / Solid Wood' },
        { label: 'Finish', value: 'High-Quality Laminate / Veneer Finish' },
        { label: 'Assembly Required', value: 'Professional Installation Included' },
        { label: 'Warranty', value: '12 Months Warranty Against Manufacturing Defects' },
        { label: 'Weight Capacity', value: product?.category?.includes('bed') ? '300 kg' : '150 kg' },
        { label: 'Color Options', value: 'Brown, Walnut, White, Black' },
        { label: 'Care Instructions', value: 'Clean with dry cloth, avoid direct sunlight' },
        { label: 'Origin', value: 'Made in India' }
      ];
    } else if (category.includes('fridge') || category.includes('refrigerator')) {
      return [
        { label: 'Capacity', value: '190L - 340L' },
        { label: 'Energy Rating', value: '5 Star BEE Rating' },
        { label: 'Compressor Type', value: 'Digital Inverter Compressor' },
        { label: 'Cooling Technology', value: 'Multi-Air Flow / Frost Free' },
        { label: 'Shelf Material', value: 'Toughened Glass' },
        { label: 'Warranty', value: '10 Years on Compressor, 1 Year on Product' },
        { label: 'Power Consumption', value: '120-150 Units/Year' },
        { label: 'Dimensions (HxWxD)', value: '165 x 54 x 62 cm' }
      ];
    } else if (category.includes('tv') || category.includes('television')) {
      return [
        { label: 'Screen Size', value: '32" - 65"' },
        { label: 'Resolution', value: '4K Ultra HD (3840 x 2160)' },
        { label: 'Display Type', value: 'QLED / OLED / LED' },
        { label: 'Refresh Rate', value: '60Hz - 120Hz' },
        { label: 'Smart TV', value: 'Yes, with Built-in Wi-Fi' },
        { label: 'Operating System', value: 'Android TV / webOS / Tizen' },
        { label: 'HDMI Ports', value: '3 Ports' },
        { label: 'USB Ports', value: '2 Ports' },
        { label: 'Warranty', value: '2 Years Comprehensive' }
      ];
    } else if (category.includes('ac') || category.includes('air conditioner')) {
      return [
        { label: 'Capacity', value: '1 Ton / 1.5 Ton / 2 Ton' },
        { label: 'Energy Rating', value: '5 Star BEE Rating' },
        { label: 'Compressor Type', value: 'Inverter Compressor' },
        { label: 'Cooling Capacity', value: '3500W - 5200W' },
        { label: 'Air Flow', value: '550 CFM' },
        { label: 'Refrigerant', value: 'R-32 Eco-Friendly Gas' },
        { label: 'Warranty', value: '5 Years on PCB, 10 Years on Compressor' },
        { label: 'Filter Type', value: 'Anti-Bacterial + PM 2.5 Filter' }
      ];
    } else if (category.includes('washing machine') || category.includes('washer')) {
      return [
        { label: 'Capacity', value: '6.5 kg - 8 kg' },
        { label: 'Type', value: 'Fully Automatic Front Load / Top Load' },
        { label: 'Energy Rating', value: '5 Star BEE Rating' },
        { label: 'Spin Speed', value: '1200 RPM' },
        { label: 'Wash Programs', value: '15+ Wash Programs' },
        { label: 'Warranty', value: '2 Years on Product, 5 Years on Motor' },
        { label: 'Special Features', value: 'Inverter Technology, Steam Wash, Quick Wash' }
      ];
    } else if (category.includes('microwave') || category.includes('oven')) {
      return [
        { label: 'Capacity', value: '20L - 32L' },
        { label: 'Type', value: 'Convection Microwave Oven' },
        { label: 'Power Output', value: '800W - 1200W' },
        { label: 'Cooking Modes', value: 'Microwave, Grill, Convection, Auto Cook' },
        { label: 'Capacity (Liters)', value: product?.specifications?.capacity || '28L' },
        { label: 'Warranty', value: '2 Years Product Warranty' },
        { label: 'Control Type', value: 'Touch Control / Rotary Dial' }
      ];
    }
    
    // Default specifications
    return [
      { label: 'Brand', value: product?.brand || 'Premium Quality' },
      { label: 'Model', value: product?.name?.replace(/\s/g, '') || 'Standard Model' },
      { label: 'Condition', value: product?.condition || 'Excellent' },
      { label: 'Warranty', value: '12 Months Warranty' },
      { label: 'Delivery', value: 'Free Delivery & Installation' },
      { label: 'Return Policy', value: '7 Days Return Policy' }
    ];
  };

  // Get category-specific icon
  const getCategoryIcon = () => {
    const category = product?.category?.toLowerCase() || '';
    if (category.includes('bed')) return <FaCouch />;
    if (category.includes('sofa')) return <FaCouch />;
    if (category.includes('table')) return <FaBox />;
    if (category.includes('fridge')) return <FaTemperatureHigh />;
    if (category.includes('ac')) return <FaTemperatureHigh />;
    if (category.includes('washer')) return <FaWater />;
    if (category.includes('tv')) return <FaBolt />;
    return <FaBox />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/products')} 
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const totalRent = (product.monthlyRent || 0) * selectedTenure * quantity;
  const totalPayable = totalRent + (product.securityDeposit || 0);
  const isInStock = (product.availableQuantity || 0) > 0;

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
            e.target.src = 'https://via.placeholder.com/400x400?text=Product+Image';
          }}
        />
      ) : (
        <div className="text-center">
          <div className="text-6xl mb-4">{getCategoryIcon()}</div>
          <p className="text-gray-400">No image available</p>
        </div>
      )}
    </div>
    
    {/* Arrow Buttons - Fixed with higher z-index */}
    {product.images && product.images.length > 1 && (
      <>
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full shadow-lg transition z-30 w-10 h-10 flex items-center justify-center"
          aria-label="Previous image"
        >
          <FaChevronLeft size={20} />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full shadow-lg transition z-30 w-10 h-10 flex items-center justify-center"
          aria-label="Next image"
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
              {product.category || 'Uncategorized'} {product.subCategory ? `/ ${product.subCategory}` : ''}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
          
          {/* Brand Badge */}
          {product.brand && (
            <div className="mb-3">
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                Brand: {product.brand}
              </span>
            </div>
          )}
          
          {/* Ratings Section */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
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
              <span className="text-4xl font-bold text-blue-600">₹{product.monthlyRent || 0}</span>
              <span className="text-gray-500">/month</span>
            </div>
            <div className="text-gray-500 text-sm mt-1">
              Security Deposit: <span className="font-semibold">₹{product.securityDeposit || 0}</span>
              <span className="text-green-600 text-xs ml-2">(Fully Refundable)</span>
            </div>
          </div>
          
          <p className="text-gray-600 leading-relaxed mb-6">{product.description || 'No description available.'}</p>
          
          <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm"><FaTruck className="text-blue-600" /> Free Delivery</div>
            <div className="flex items-center gap-2 text-sm"><FaShieldAlt className="text-blue-600" /> Secure Deposit</div>
            <div className="flex items-center gap-2 text-sm"><FaCalendarAlt className="text-blue-600" /> Flexible Tenure</div>
            <div className="flex items-center gap-2 text-sm"><FaRupeeSign className="text-blue-600" /> Best Price Guarantee</div>
          </div>
          
          {/* Rental Tenure Selection */}
          <div className="mb-6">
            <label className="block font-medium mb-3">Select Rental Tenure</label>
            <div className="flex flex-wrap gap-3">
              {[1, 3, 6, 12].map(tenure => (
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
                onClick={() => setQuantity(Math.min(product.availableQuantity || 99, quantity + 1))}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-blue-600 transition"
              >
                <FaPlus />
              </button>
              <span className="text-sm text-gray-500">{product.availableQuantity || 99} available</span>
            </div>
          </div>
          
          {/* Price Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3">Price Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Rent</span>
                <span>₹{product.monthlyRent || 0} × {selectedTenure} months × {quantity}</span>
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
              className="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!isInStock}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
            className={`pb-3 font-medium transition whitespace-nowrap ${
              activeTab === 'details' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Product Details
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`pb-3 font-medium transition whitespace-nowrap ${
              activeTab === 'specifications' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 font-medium transition whitespace-nowrap ${
              activeTab === 'reviews' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Reviews ({product.numReviews || 0})
          </button>
        </div>
        
        {/* Product Details Tab */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description || 'No details available.'}</p>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Key Highlights</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">Premium quality material with elegant finish</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">Free delivery and installation included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">12 months warranty against manufacturing defects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">Flexible rental tenure options available</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">Easy maintenance and customer support</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">What's Included</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <FaBox className="text-blue-500 mt-1" />
                    <span className="text-gray-600">Main Product Unit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaBox className="text-blue-500 mt-1" />
                    <span className="text-gray-600">User Manual & Warranty Card</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaBox className="text-blue-500 mt-1" />
                    <span className="text-gray-600">Accessories (as applicable)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaBox className="text-blue-500 mt-1" />
                    <span className="text-gray-600">Free Installation Service</span>
                  </li>
                </ul>
                
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold mb-2 text-yellow-800">📋 Important Notes</h3>
                  <ul className="space-y-1 text-sm text-yellow-700">
                    <li>• Images are for illustration purposes only</li>
                    <li>• Actual product may vary slightly</li>
                    <li>• Please check delivery availability for your pincode</li>
                    <li>• Security deposit is fully refundable</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Technical Specifications Tab - Professional Table Format */}
        {activeTab === 'specifications' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Specification</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Product Name</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.name}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Category</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category} {product.subCategory ? `/ ${product.subCategory}` : ''}</td>
                  </tr>
                  {product.brand && (
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">Brand</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.brand}</td>
                    </tr>
                  )}
                  {product.condition && (
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">Condition</td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">{product.condition}</td>
                    </tr>
                  )}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Monthly Rent</td>
                    <td className="px-6 py-4 text-sm text-gray-600">₹{product.monthlyRent}/month</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Security Deposit</td>
                    <td className="px-6 py-4 text-sm text-gray-600">₹{product.securityDeposit} (Fully Refundable)</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Available Quantity</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.availableQuantity || 15} units</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Rental Tenure Options</td>
                    <td className="px-6 py-4 text-sm text-gray-600">1, 3, 6, 12 Months</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Warranty</td>
                    <td className="px-6 py-4 text-sm text-gray-600">12 Months Warranty</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Delivery</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Free Delivery & Installation</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Return Policy</td>
                    <td className="px-6 py-4 text-sm text-gray-600">7 Days Return Policy</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Reviews Tab - Professional Review Section */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Rating Summary */}
            <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-white">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600">{product.rating || 0}</div>
                  <div className="flex gap-1 mt-2">{renderStars(product.rating || 0)}</div>
                  <div className="text-sm text-gray-500 mt-1">{product.numReviews || 0} ratings</div>
                </div>
                <div className="flex-1">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm w-16">5 Star</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${((product.ratingDistribution?.five || 0) / (product.numReviews || 1)) * 100}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-500 w-12">{product.ratingDistribution?.five || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm w-16">4 Star</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${((product.ratingDistribution?.four || 0) / (product.numReviews || 1)) * 100}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-500 w-12">{product.ratingDistribution?.four || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm w-16">3 Star</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${((product.ratingDistribution?.three || 0) / (product.numReviews || 1)) * 100}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-500 w-12">{product.ratingDistribution?.three || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm w-16">2 Star</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${((product.ratingDistribution?.two || 0) / (product.numReviews || 1)) * 100}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-500 w-12">{product.ratingDistribution?.two || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm w-16">1 Star</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${((product.ratingDistribution?.one || 0) / (product.numReviews || 1)) * 100}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-500 w-12">{product.ratingDistribution?.one || 0}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Write a Review
                  </button>
                </div>
              </div>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="p-6 border-b bg-yellow-50">
                <h3 className="font-semibold mb-3">Share Your Experience</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewData({ ...reviewData, rating: star })}
                          className="focus:outline-none"
                        >
                          {star <= reviewData.rating ? (
                            <FaStar className="text-yellow-400 text-2xl" />
                          ) : (
                            <FaRegStar className="text-gray-400 text-2xl" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Review</label>
                    <textarea
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Write your review here... What did you like or dislike about this product?"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitReview}
                      disabled={submitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews List */}
            <div className="divide-y divide-gray-200">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review, idx) => (
                  <div key={idx} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold">{review.user?.name || 'Anonymous User'}</p>
                          <div className="flex gap-1 mt-1">{renderStars(review.rating)}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-green-600 hover:text-green-700">
                          <FaThumbsUp size={14} />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          <FaThumbsDown size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 ml-13">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-2 ml-13">
                      Verified Purchase • {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
                  <p className="text-gray-500 mb-4">Be the first to review this product!</p>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Write a Review
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
