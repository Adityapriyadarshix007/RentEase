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
          toast.error(`Failed to create rental for ${item.productName}`);
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                <input type="text" name="street" value={address.street} onChange={handleAddressChange} required className="w-full px-4 py-2 border rounded-lg" placeholder="House No, Building, Street" />
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">City *</label><input type="text" name="city" value={address.city} onChange={handleAddressChange} required className="w-full px-4 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">State *</label><input type="text" name="state" value={address.state} onChange={handleAddressChange} required className="w-full px-4 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label><input type="text" name="pincode" value={address.pincode} onChange={handleAddressChange} required maxLength="6" className="w-full px-4 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label><input type="text" name="landmark" value={address.landmark} onChange={handleAddressChange} className="w-full px-4 py-2 border rounded-lg" placeholder="Near any landmark" /></div>
            </div>
          </div>
          
          {/* Delivery Schedule */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">📅 Delivery Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date *</label><input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required className="w-full px-4 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Delivery Slot *</label><select value={deliverySlot} onChange={(e) => setDeliverySlot(e.target.value)} className="w-full px-4 py-2 border rounded-lg"><option value="morning">Morning (9 AM - 12 PM)</option><option value="afternoon">Afternoon (12 PM - 4 PM)</option><option value="evening">Evening (4 PM - 8 PM)</option></select></div>
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">💳 Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"><input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-3" /><span className="text-lg mr-2">💰</span><span className="flex-1">Cash on Delivery</span></label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"><input type="radio" name="paymentMethod" value="online" checked={paymentMethod === 'online'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-3" /><span className="text-lg mr-2">💳</span><span className="flex-1">Card/UPI/NetBanking</span><span className="text-xs text-green-600">(Coming Soon)</span></label>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="max-h-80 overflow-y-auto mb-4 space-y-3">
              {cartItems.map((item) => (<div key={item.productId} className="flex justify-between py-2 border-b"><div><p className="font-medium">{item.productName}</p><p className="text-sm text-gray-500">{item.quantity} × {item.tenureMonths} months</p></div><span className="font-semibold">₹{item.monthlyRent * item.tenureMonths * item.quantity}</span></div>))}
            </div>
            <div className="space-y-2 mb-4"><div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div><div className="flex justify-between"><span>Delivery Charges</span><span className="text-green-600">FREE</span></div><div className="flex justify-between"><span>Security Deposit</span><span>₹{totalDeposit}</span></div><div className="border-t pt-2 mt-2"><div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-blue-600">₹{total}</span></div><p className="text-xs text-gray-500 mt-1">Security deposit collected separately</p></div></div>
            <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">{loading ? 'Processing...' : `Place Order • ₹${total}`}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
