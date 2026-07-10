import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, updateTenure, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deliveryCharges, setDeliveryCharges] = useState({});
  const [loading, setLoading] = useState(true);
  const [userCity, setUserCity] = useState('');
  const [showCityDialog, setShowCityDialog] = useState(false);
  const [tempCity, setTempCity] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'https://rentease-backend-njvk.onrender.com';

  // Available cities list
  const availableCities = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune'];

  // Get user's city
  useEffect(() => {
    const city = localStorage.getItem('userCity') || user?.address?.city || 'Delhi';
    setUserCity(city);
    setTempCity(city);
  }, [user]);

  // Calculate delivery charges for all cart items
  useEffect(() => {
    if (cartItems.length > 0 && userCity) {
      calculateDeliveryCharges();
    } else {
      setLoading(false);
    }
  }, [cartItems, userCity]);

  // ========== Calculate delivery charges with fallback ==========
  const calculateDeliveryCharges = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const productIds = cartItems.map(item => item.productId);
      
      const response = await fetch(`${API_URL}/api/products/calculate-delivery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          productIds, 
          userCity 
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        const charges = {};
        data.data.products.forEach(p => {
          charges[p.productId] = p.deliveryCharge || 0;
        });
        setDeliveryCharges(charges);
        console.log('✅ Delivery charges from API:', charges);
      } else {
        calculateDeliveryLocally();
      }
    } catch (error) {
      console.error('Error calculating delivery, using fallback:', error);
      calculateDeliveryLocally();
    } finally {
      setLoading(false);
    }
  };

  // ========== FALLBACK: Calculate delivery locally ==========
  const calculateDeliveryLocally = () => {
    console.log('📦 Using local delivery calculation for city:', userCity);
    const charges = {};
    cartItems.forEach(item => {
      const isAvailable = item.city === userCity || 
                         item.city === 'All India' ||
                         (item.availableCities && item.availableCities.includes(userCity));
      
      const charge = isAvailable ? 0 : (item.outOfCityDeliveryCharge || 299);
      charges[item.productId] = charge;
      
      console.log(`  ${item.productName}: ${isAvailable ? '✅ Available' : '❌ Not available'} - Charge: ₹${charge}`);
    });
    setDeliveryCharges(charges);
  };

  // ========== Handle city change ==========
  const handleCityChange = () => {
    setTempCity(userCity);
    setShowCityDialog(true);
  };

  const confirmCityChange = () => {
    if (tempCity && tempCity !== userCity) {
      localStorage.setItem('userCity', tempCity);
      setUserCity(tempCity);
      calculateDeliveryCharges();
      toast.success(`City changed to ${tempCity}`);
    }
    setShowCityDialog(false);
  };

  const cancelCityChange = () => {
    setTempCity(userCity);
    setShowCityDialog(false);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Browse Products
        </Link>
      </div>
    );
  }

  // Calculate totals with delivery
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.monthlyRent * item.tenureMonths * item.quantity);
  }, 0);

  const totalDelivery = cartItems.reduce((sum, item) => {
    return sum + (deliveryCharges[item.productId] || 0);
  }, 0);

  const grandTotal = subtotal + totalDelivery;

  const getDeliveryStatus = (item) => {
    const charge = deliveryCharges[item.productId];
    if (charge === undefined) return 'Calculating...';
    if (charge === 0) {
      const isAvailable = item.city === userCity || 
                         item.city === 'All India' ||
                         (item.availableCities && item.availableCities.includes(userCity));
      if (isAvailable) {
        return '✅ Free (Available in your city)';
      }
      return '✅ Free';
    }
    return `🚚 ₹${charge} (Ships from ${item.city || 'another city'})`;
  };

  // ========== Get display city name ==========
  const getDisplayCity = (item) => {
    if (item.city && item.city !== 'Unknown' && item.city !== '') {
      return item.city;
    }
    if (item.availableCities && item.availableCities.length > 0) {
      return item.availableCities[0];
    }
    return 'N/A';
  };

  // ========== Get city badge color ==========
  const getCityBadgeColor = (item) => {
    if (item.city === 'All India') {
      return 'bg-green-100 text-green-800';
    }
    if (item.city === userCity) {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-600';
  };

  // ========== Check if product is available in user's city ==========
  const isProductAvailableInCity = (item) => {
    return item.city === userCity || 
           item.city === 'All India' ||
           (item.availableCities && item.availableCities.includes(userCity));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <p className="text-gray-600 mb-6">{cartItems.length} items in your cart</p>
      
      {/* City indicator with button */}
      <div className="bg-blue-50 rounded-lg p-3 mb-6 flex items-center justify-between">
        <p className="text-sm text-blue-700">
          📍 Delivering to: <strong>{userCity}</strong>
        </p>
        <button 
          onClick={handleCityChange}
          className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
        >
          Change City
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const itemTotal = item.monthlyRent * item.tenureMonths * item.quantity;
            const deliveryCharge = deliveryCharges[item.productId] || 0;
            const itemGrandTotal = itemTotal + deliveryCharge;
            const displayCity = getDisplayCity(item);
            const cityBadgeColor = getCityBadgeColor(item);
            const isAvailableInCity = isProductAvailableInCity(item);
            
            return (
              <div key={item.productId} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Product Image */}
                  <div className="md:w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <span className="text-4xl">🛋️</span>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{item.productName}</h3>
                    <p className="text-gray-600 text-sm mb-2">{item.subCategory || item.category}</p>
                    <p className="text-blue-600 font-semibold">₹{item.monthlyRent}/month</p>
                    
                    {/* City info with badge */}
                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-500">📦 Located in:</span>
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${cityBadgeColor}`}>
                        {displayCity}
                      </span>
                      {displayCity === userCity && (
                        <span className="text-xs text-green-600 font-medium">(Your city)</span>
                      )}
                      {displayCity === 'All India' && (
                        <span className="text-xs text-green-600 font-medium">(Nationwide)</span>
                      )}
                      {!isAvailableInCity && displayCity !== 'All India' && (
                        <span className="text-xs text-orange-500 font-medium">(Ships from here)</span>
                      )}
                    </div>
                    
                    {/* Available Cities */}
                    {item.availableCities && item.availableCities.length > 0 && item.city !== 'All India' && (
                      <div className="mt-1">
                        <span className="text-xs text-gray-500">📦 Available in: </span>
                        <span className="text-xs text-gray-600">
                          {item.availableCities.map((city, index) => (
                            <span key={city}>
                              {city}
                              {city === userCity && <span className="text-green-600 font-medium"> ✓</span>}
                              {index < item.availableCities.length - 1 && ', '}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                    
                    {/* Delivery info */}
                    <div className="mt-2">
                      <p className="text-sm">
                        <span className="text-gray-600">Delivery: </span>
                        <span className={deliveryCharge === 0 ? 'text-green-600 font-semibold' : 'text-orange-600 font-semibold'}>
                          {getDeliveryStatus(item)}
                        </span>
                      </p>
                      {deliveryCharge > 0 && (
                        <p className="text-xs text-gray-500">
                          💡 Product ships from {displayCity} to {userCity}
                        </p>
                      )}
                      {deliveryCharge === 0 && item.city === 'All India' && (
                        <p className="text-xs text-green-500">Available nationwide with free delivery</p>
                      )}
                      {deliveryCharge === 0 && item.city !== 'All India' && isAvailableInCity && (
                        <p className="text-xs text-green-500">✅ Available in {userCity} - Free delivery</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Tenure</label>
                      <select
                        value={item.tenureMonths}
                        onChange={(e) => updateTenure(item.productId, parseInt(e.target.value))}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        {[1, 3, 6, 12].map(tenure => (
                          <option key={tenure} value={tenure}>
                            {tenure} {tenure === 1 ? 'Month' : 'Months'}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Quantity</label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 hover:text-red-700 text-sm flex items-center justify-center"
                    >
                      <FaTrash className="mr-1" /> Remove
                    </button>
                  </div>
                  
                  {/* Price */}
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">₹{itemGrandTotal}</p>
                    <p className="text-sm text-gray-500">
                      Rent: ₹{itemTotal}
                      {deliveryCharge > 0 && (
                        <span className="block text-orange-500 text-xs">+ ₹{deliveryCharge} delivery</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className={totalDelivery > 0 ? 'text-orange-600' : 'text-green-600'}>
                  {totalDelivery > 0 ? `₹${totalDelivery}` : 'FREE'}
                </span>
              </div>
              {totalDelivery > 0 && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  {cartItems.filter(item => (deliveryCharges[item.productId] || 0) > 0).length} item(s) will be shipped from other cities
                </div>
              )}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">₹{grandTotal}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  *Security deposits will be collected separately
                </p>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Calculating...' : `Proceed to Checkout • ₹${grandTotal}`}
            </button>
            
            <Link to="/products" className="block text-center text-blue-600 hover:underline mt-4">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* ========== CITY SELECTION DIALOG ========== */}
      {showCityDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            {/* Dialog Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Select Your City</h2>
              <button
                onClick={cancelCityChange}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <FaTimes />
              </button>
            </div>
            
            {/* Dialog Body */}
            <div className="p-4">
              <p className="text-gray-600 mb-4">
                Choose your city to see product availability and delivery charges.
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                {availableCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setTempCity(city)}
                    className={`p-3 rounded-lg border-2 transition text-center ${
                      tempCity === city
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {city}
                    {tempCity === city && (
                      <span className="block text-xs text-blue-600">✓ Selected</span>
                    )}
                  </button>
                ))}
              </div>
              
              {tempCity !== userCity && (
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-700">
                  ⚠️ Changing city will recalculate delivery charges
                </div>
              )}
            </div>
            
            {/* Dialog Footer */}
            <div className="flex justify-end gap-3 p-4 border-t">
              <button
                onClick={cancelCityChange}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmCityChange}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Apply City
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;