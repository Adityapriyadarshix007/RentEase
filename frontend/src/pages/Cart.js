import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, updateTenure, getCartTotal } = useCart();
  const navigate = useNavigate();

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

  const subtotal = getCartTotal();
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <p className="text-gray-600 mb-6">{cartItems.length} items in your cart</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const itemTotal = item.monthlyRent * item.tenureMonths * item.quantity;
            
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
                    <p className="text-xl font-bold text-blue-600">₹{itemTotal}</p>
                    <p className="text-sm text-gray-500">Total for {item.quantity} item(s)</p>
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
                <span className="text-green-600">FREE</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">₹{total}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  *Security deposits will be collected separately
                </p>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Proceed to Checkout
            </button>
            
            <Link to="/products" className="block text-center text-blue-600 hover:underline mt-4">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
