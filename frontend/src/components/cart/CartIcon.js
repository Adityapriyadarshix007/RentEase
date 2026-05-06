import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

const CartIcon = () => {
  const { getCartCount } = useCart();
  const itemCount = getCartCount();

  return (
    <Link to="/cart" className="relative">
      <FaShoppingCart className="text-2xl text-gray-700 hover:text-primary transition" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          {itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;