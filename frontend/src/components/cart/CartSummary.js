import React from 'react';
import { formatPrice } from '../../utils/formatters';
import { FaTruck, FaShieldAlt, FaCreditCard } from 'react-icons/fa';

const CartSummary = ({ subtotal, deliveryFee = 0, discount = 0, total }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery Charges</span>
          <span className="text-green-600">{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Discount</span>
            <span className="text-red-600">-{formatPrice(discount)}</span>
          </div>
        )}
        
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 mb-4 pt-4 border-t">
        <div className="flex items-center text-sm text-gray-600">
          <FaTruck className="text-primary mr-2" />
          <span>Free delivery on all orders</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FaShieldAlt className="text-primary mr-2" />
          <span>Secure payment protected</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FaCreditCard className="text-primary mr-2" />
          <span>Multiple payment options</span>
        </div>
      </div>
      
      <button className="w-full btn-primary py-3">
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;