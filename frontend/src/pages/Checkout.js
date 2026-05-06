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

  // ALL PAYMENT OPTIONS
  const paymentMethods = [
    { id: 'cod', name: 'Cash on Delivery', icon: '💰', description: 'Pay when you receive the product' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Pay securely with card' },
    { id: 'upi', name: 'UPI', icon: '📱', description: 'Google Pay, PhonePe, Paytm' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦', description: 'All major banks' },
    { id: 'wallet', name: 'Digital Wallet', icon: '👛', description: 'Paytm, Amazon Pay, MobiKwik' }
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
      const token = localStorage.getItem('token');
      let successCount = 0;
      
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
        
        const response = await fetch('https://rentease-backend-njvk.onrender.com/api/rentals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(rentalData)
        });
        
        if (response.ok) {
          successCount++;
        } else {
          const errorData = await response.json();
          console.error('Rental creation failed:', errorData);
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
      toast.error('Network error. Please try again.');
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
            <h2 className="text-xl font-semibold mb-4">📍 Delivery Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input type="text" name="street" value={address.street} onChange={handleAddressChange} placeholder="Street Address *" className="w-full px-4 py-2 border rounded-lg" required />
              </div>
              <input type="text" name="city" value={address.city} onChange={handleAddressChange} placeholder="City *" className="w-full px-4 py-2 border rounded-lg" required />
              <input type="text" name="state" value={address.state} onChange={handleAddressChange} placeholder="State *" className="w-full px-4 py-2 border rounded-lg" required />
              <input type="text" name="pincode" value={address.pincode} onChange={handleAddressChange} placeholder="Pincode *" className="w-full px-4 py-2 border rounded-lg" maxLength="6" required />
              <input type="text" name="landmark" value={address.landmark} onChange={handleAddressChange} placeholder="Landmark" className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
          
          {/* Delivery Schedule */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">📅 Delivery Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2 border rounded-lg" required />
              <select value={deliverySlot} onChange={(e) => setDeliverySlot(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                <option value="morning">Morning (9 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                <option value="evening">Evening (4 PM - 8 PM)</option>
              </select>
            </div>
          </div>
          
          {/* ALL Payment Methods */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">💳 Select Payment Method</h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label key={method.id} className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${paymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                  <input type="radio" name="paymentMethod" value={method.id} checked={paymentMethod === method.id} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-3 w-4 h-4" />
                  <span className="text-2xl mr-3">{method.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                  {paymentMethod === method.id && <span className="text-green-500 text-sm">✓ Selected</span>}
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
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-500">{item.quantity} × {item.tenureMonths} months</p>
                  </div>
                  <span className="font-semibold">₹{item.monthlyRent * item.tenureMonths * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between"><span>Delivery Charges</span><span className="text-green-600">FREE</span></div>
              <div className="flex justify-between"><span>Security Deposit</span><span>₹{totalDeposit}</span></div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-blue-600">₹{total}</span></div>
                <p className="text-xs text-gray-500 mt-1">Security deposit collected separately</p>
              </div>
            </div>
            <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? 'Processing...' : `Place Order • ₹${total}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
