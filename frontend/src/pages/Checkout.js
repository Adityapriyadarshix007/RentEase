import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliverySlot, setDeliverySlot] = useState('morning');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });
  const [pincodeValid, setPincodeValid] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'https://rentease-backend-njvk.onrender.com';
  const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_SoJcSoBvNFxUU0';

  // Payment Methods - Simplified
  const paymentMethods = [
    { 
      id: 'razorpay', 
      name: 'Pay Online', 
      icon: '💳', 
      description: 'Credit/Debit Card • UPI • NetBanking • Wallet',
      subtext: 'Secure payment by Razorpay'
    },
    { 
      id: 'cod', 
      name: 'Cash on Delivery', 
      icon: '💰', 
      description: 'Pay when you receive the product',
      subtext: 'Pay in cash at delivery time'
    }
  ];

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDeliveryDate(tomorrow.toISOString().split('T')[0]);
    
    if (user?.address) {
      setAddress({
        street: user.address.street || '',
        city: user.address.city || '',
        state: user.address.state || '',
        pincode: user.address.pincode || '',
        landmark: user.address.landmark || ''
      });
    }
  }, [cartItems, navigate, user]);

  // Validate pincode
  useEffect(() => {
    if (address.pincode.length === 6) {
      validatePincode(address.pincode);
    }
  }, [address.pincode]);

  const validatePincode = async (pincode) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/rentals/validate-pincode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pincode })
      });
      const data = await response.json();
      if (data.success) {
        setPincodeValid(true);
        toast.success('Delivery available at this location');
      } else {
        setPincodeValid(false);
        toast.error(data.message || 'Delivery not available at this pincode');
      }
    } catch (error) {
      console.error('Pincode validation error:', error);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createRentalOrder = async (item) => {
    const rentalData = {
      productId: item.productId,
      tenureMonths: item.tenureMonths,
      quantity: item.quantity,
      deliveryAddress: address,
      deliveryDate: deliveryDate,
      deliverySlot: deliverySlot,
      paymentMethod: paymentMethod
    };
    
    const response = await fetch(`${API_URL}/api/rentals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(rentalData)
    });
    
    return await response.json();
  };

  const handleRazorpayPayment = async (orderId, amount, rentalId) => {
    const options = {
      key: RAZORPAY_KEY,
      amount: amount,
      currency: 'INR',
      name: 'RentEase',
      description: 'Rental Payment',
      order_id: orderId,
      handler: async (response) => {
        // Verify payment
        const verifyResponse = await fetch(`${API_URL}/api/payments/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            rentalId: rentalId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            paymentMethod: 'razorpay'
          })
        });
        
        const data = await verifyResponse.json();
        if (data.success) {
          toast.success('Payment successful! Order placed successfully');
          clearCart();
          navigate('/my-rentals');
        } else {
          toast.error('Payment verification failed');
        }
      },
      prefill: {
        name: user?.name,
        email: user?.email,
        contact: user?.phone
      },
      notes: {
        address: `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`
      },
      theme: { color: '#3B82F6' },
      modal: {
        ondismiss: () => {
          toast.error('Payment cancelled');
          setLoading(false);
        }
      }
    };
    
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!address.street || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill in all address fields');
      return;
    }
    
    if (address.pincode.length !== 6) {
      toast.error('Pincode must be 6 digits');
      return;
    }
    
    if (false) {
      toast.error('Please enter a valid serviceable pincode');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Create rentals for all cart items
      const rentals = [];
      for (const item of cartItems) {
        const result = await createRentalOrder(item);
        if (result.success) {
          rentals.push(result.rental);
        }
      }
      
      if (rentals.length === 0) {
        toast.error('Failed to create rental orders');
        setLoading(false);
        return;
      }
      
      // Handle COD: Direct success
      if (paymentMethod === 'cod') {
        toast.success(`Order placed successfully! ${rentals.length} item(s) will be delivered COD`);
        clearCart();
        navigate('/my-rentals');
        setLoading(false);
        return;
      }
      
      // Handle Razorpay - Multiple Rentals Fix
if (paymentMethod === 'razorpay') {
  // Create all rentals first
  const rentals = [];
  for (const item of cartItems) {
    const rentalData = {
      productId: item.productId,
      tenureMonths: item.tenureMonths,
      quantity: item.quantity,
      deliveryAddress: address,
      deliveryDate: deliveryDate,
      deliverySlot: deliverySlot,
      paymentMethod: paymentMethod
    };
    
    const response = await fetch(`${API_URL}/api/rentals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(rentalData)
    });
    
    const data = await response.json();
    if (data.success) {
      rentals.push(data.rental);
    }
  }
  
  if (rentals.length === 0) {
    toast.error('Failed to create rentals');
    setLoading(false);
    return;
  }
  
  // Calculate total amount
  const totalAmount = cartItems.reduce((sum, item) => {
    return sum + (item.monthlyRent * item.tenureMonths * item.quantity);
  }, 0) + cartItems.reduce((sum, item) => sum + (item.securityDeposit || 0), 0);
  
  // Create a GROUP payment intent (for all rentals)
  const groupOrderResponse = await fetch(`${API_URL}/api/payments/create-group-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ 
      rentalIds: rentals.map(r => r._id),
      totalAmount: totalAmount
    })
  });
  
  const groupOrderData = await groupOrderResponse.json();
  
  if (groupOrderData.success) {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      toast.error('Failed to load payment gateway');
      setLoading(false);
      return;
    }
    
    const options = {
      key: RAZORPAY_KEY,
      amount: groupOrderData.order.amount,
      currency: 'INR',
      name: 'RentEase',
      description: `Payment for ${rentals.length} items`,
      order_id: groupOrderData.order.id,
      handler: async (response) => {
        // Verify payment for ALL rentals
        const verifyResponse = await fetch(`${API_URL}/api/payments/verify-group-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            rentalIds: rentals.map(r => r._id),
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            paymentMethod: 'razorpay'
          })
        });
        
        const verifyData = await verifyResponse.json();
        if (verifyData.success) {
          toast.success(`Payment successful! ${rentals.length} items rented`);
          clearCart();
          navigate('/my-rentals');
        } else {
          toast.error('Payment verification failed');
        }
      },
      prefill: { name: user?.name, email: user?.email },
      theme: { color: '#3B82F6' },
      modal: { ondismiss: () => { toast.error('Payment cancelled'); setLoading(false); } }
    };
    
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } else {
    toast.error('Failed to initialize payment');
  }
}
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  if (cartItems.length === 0) {
    return null;
  }

  const subtotal = getCartTotal();
  const totalDeposit = cartItems.reduce((sum, item) => sum + (item.securityDeposit || 0), 0);
  const grandTotal = subtotal + totalDeposit;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">📍 Delivery Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  placeholder="Street Address *"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                placeholder="City *"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                placeholder="State *"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <div>
                <input
                  type="text"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleAddressChange}
                  placeholder="Pincode *"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${!pincodeValid && address.pincode.length === 6 ? 'border-red-500' : ''}`}
                  maxLength="6"
                  required
                />
                {!pincodeValid && address.pincode.length === 6 && (
                  <p className="text-red-500 text-xs mt-1">Delivery not available at this pincode</p>
                )}
              </div>
              <input
                type="text"
                name="landmark"
                value={address.landmark}
                onChange={handleAddressChange}
                placeholder="Landmark (Optional)"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Delivery Schedule */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">📅 Delivery Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Slot</label>
                <select
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                  <option value="evening">Evening (4 PM - 8 PM)</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Payment Methods - Simplified */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">💳 Select Payment Method</h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                    paymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 w-4 h-4"
                  />
                  <span className="text-2xl mr-3">{method.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-gray-500">{method.description}</p>
                    <p className="text-xs text-gray-400">{method.subtext}</p>
                  </div>
                  {paymentMethod === method.id && <span className="text-green-500 text-sm">✓ Selected</span>}
                </label>
              ))}
            </div>
            {paymentMethod === 'razorpay' && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">🔒 Secure payment powered by Razorpay. Accepts all cards, UPI, NetBanking & Wallets.</p>
              </div>
            )}
            {paymentMethod === 'cod' && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-600">💰 Pay in cash when your order is delivered. No online payment required.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="max-h-80 overflow-y-auto mb-4 space-y-3">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {item.tenureMonths} months @ ₹{item.monthlyRent}/month
                    </p>
                  </div>
                  <span className="font-semibold">₹{item.monthlyRent * item.tenureMonths * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Security Deposit</span>
                <span>₹{totalDeposit}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total to Pay</span>
                  <span className="text-blue-600">₹{grandTotal}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Security deposit is refundable after inspection
                </p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || !pincodeValid}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Place Order • ₹${grandTotal}`}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">
              By placing order, you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;