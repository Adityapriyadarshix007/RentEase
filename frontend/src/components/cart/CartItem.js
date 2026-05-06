import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { formatPrice } from '../../utils/formatters';

const CartItem = ({ item, onUpdateQuantity, onUpdateTenure, onRemove }) => {
  const itemTotal = item.product.monthlyRent * item.tenureMonths * item.quantity;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Product Image */}
        <div className="md:w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center">
          {item.product.images && item.product.images[0] ? (
            <img
              src={item.product.images[0]}
              alt={item.product.name}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-4xl">🛋️</div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="flex-1">
          <Link to={`/products/${item.product._id}`}>
            <h3 className="text-xl font-semibold hover:text-primary transition">
              {item.product.name}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm mb-2">{item.product.subCategory}</p>
          <p className="text-primary font-semibold">
            {formatPrice(item.product.monthlyRent)}/month
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tenure (months)</label>
            <select
              value={item.tenureMonths}
              onChange={(e) => onUpdateTenure(item.product._id, parseInt(e.target.value))}
              className="input py-1 px-2 text-sm"
            >
              {item.product.rentalTenureOptions.map(tenure => (
                <option key={tenure} value={tenure}>
                  {tenure} {tenure === 1 ? 'Month' : 'Months'}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Quantity</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onUpdateQuantity(item.product._id, item.quantity - 1)}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <FaMinus size={12} />
              </button>
              <span className="w-8 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.product._id, item.quantity + 1)}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                disabled={item.quantity >= item.product.availableQuantity}
              >
                <FaPlus size={12} />
              </button>
            </div>
          </div>
          
          <button
            onClick={() => onRemove(item.product._id)}
            className="text-danger hover:text-red-700 text-sm flex items-center justify-center space-x-1 transition"
          >
            <FaTrash /> <span>Remove</span>
          </button>
        </div>
        
        {/* Price */}
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">
            {formatPrice(itemTotal)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Total for {item.quantity} item(s)
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;