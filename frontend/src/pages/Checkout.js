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
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });

  const paymentMethods = [
    { id: 'cod', name: 'Cash on Delivery', icon: '💰', description: 'Pay when you receive the product', active: true },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Pay securely with card', active: true },
    { id: 'upi', name: 'UPI', icon: '📱', description: 'Google Pay, PhonePe, Paytm', active: true },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦', description: 'All major banks', active: true },
    { id: 'wallet', name: 'Digital Wallet', icon: '👛', description: 'Paytm, Amazon Pay, MobiKwik', active: true }
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

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
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
    
    setLoading(true);
    
    try {
      let successCount = 0;
      let errorCount = 0;
      
      for (const item of cartItems) {
        const rentalData = {
          productId: item.productId,
          tenureMonths: item.tenureMonths,
          quantity: item.quantity,
          deliveryAddress: address,
          deliveryDate: deliveryDate,
          deliverySlot: deliverySlot,
          paymentMethod: paymentMethod,
          notes: `Order placed from cart`
        };
        
        console.log('Creating rental for user:', user._id);
        console.log('Rental data:', rentalData);
        
        const response = await fetch('http://localhost:5001/api/rentals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(rentalData)
        });
        
        const data = await response.json();
        console.log('Rental creation response:', data);
        
        if (response.ok) {
          successCount++;
        } else {
          errorCount++;
          console.error('Failed to create rental:', data);
        }
      }
      
      if (successCount > 0) {
        toast.success(`Order placed successfully! ${successCount} item(s) rented`);
        clearCart();
        navigate('/my-rentals');
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  const subtotal = getCartTotal();
  const totalDeposit = cartItems.reduce((sum, item) => sum + (item.securityDeposit || 0), 0);
  const total = subtotal;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">📍</span>
              Delivery Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="House No, Building, Street"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleAddressChange}
                  required
                  maxLength="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={address.landmark}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Near any landmark"
                />
              </div>
            </div>
          </div>
          
          {/* Delivery Schedule */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">📅</span>
              Delivery Schedule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Date *
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Slot *
                </label>
                <select
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                  <option value="evening">Evening (4 PM - 8 PM)</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">💳</span>
              Payment Method
            </h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    paymentMethod === method.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 w-4 h-4 text-blue-600"
                  />
                  <span className="text-2xl mr-3">{method.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{method.name}</p>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                  {paymentMethod === method.id && (
                    <span className="text-green-500 text-sm font-medium">✓ Selected</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="max-h-80 overflow-y-auto mb-4 space-y-3">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex justify-between py-2 border-b">
                  <div>
                    <p className="font-medium text-gray-800">{item.productName}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {item.tenureMonths} months × ₹{item.monthlyRent}/month
                    </p>
                  </div>
                  <span className="font-semibold text-gray-800">₹{item.monthlyRent * item.tenureMonths * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Security Deposit</span>
                <span>₹{totalDeposit}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">₹{total}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Security deposit of ₹{totalDeposit} will be collected separately
                </p>
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 shadow-md"
            >
              {loading ? 'Processing...' : `Place Order • ₹${total}`}
            </button>
            
            <div className="mt-4 text-center text-xs text-gray-500">
              <p>🔒 Your payment information is secure</p>
              <p className="mt-1">✅ Free cancellation within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
