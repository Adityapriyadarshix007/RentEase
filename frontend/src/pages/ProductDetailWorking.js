import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaTruck, FaShieldAlt, FaCalendarAlt, FaRupeeSign, FaPlus, FaMinus, FaCheckCircle } from 'react-icons/fa';

const ProductDetailWorking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTenure, setSelectedTenure] = useState(3);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/products/${id}`);
      const data = await response.json();
      setProduct(data.product);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity} x ${product?.name} for ${selectedTenure} months to cart!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Product not found</p>
          <button onClick={() => navigate('/products')} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const totalRent = product.monthlyRent * selectedTenure * quantity;
  const totalPayable = totalRent + product.securityDeposit;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/products')} className="text-blue-600 mb-4 inline-block">
        ← Back to Products
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-96">
          {product.images && product.images[0] ? (
            <img src={product.images[0]} alt={product.name} className="max-w-full max-h-full object-contain" />
          ) : (
            <div className="text-6xl">🛋️</div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-4">{product.category} / {product.subCategory}</p>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => <FaStar key={i} className={i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'} />)}
            </div>
            <span className="text-gray-500">({product.numReviews || 0} reviews)</span>
          </div>
          
          <div className="mb-4">
            <span className="text-4xl font-bold text-blue-600">₹{product.monthlyRent}</span>
            <span className="text-gray-500">/month</span>
            <p className="text-gray-500 text-sm mt-1">Security Deposit: ₹{product.securityDeposit}</p>
          </div>
          
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2"><FaTruck className="text-blue-600" /> Free Delivery</div>
            <div className="flex items-center gap-2"><FaShieldAlt className="text-blue-600" /> Secure Deposit</div>
            <div className="flex items-center gap-2"><FaCalendarAlt className="text-blue-600" /> Flexible Tenure</div>
            <div className="flex items-center gap-2"><FaRupeeSign className="text-blue-600" /> Best Price</div>
          </div>
          
          {/* Tenure Selection */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Select Tenure</label>
            <div className="flex gap-3">
              {[1, 3, 6, 12].map(tenure => (
                <button key={tenure} onClick={() => setSelectedTenure(tenure)} className={`px-4 py-2 rounded-lg border ${selectedTenure === tenure ? 'bg-blue-600 text-white' : 'border-gray-300'}`}>
                  {tenure} {tenure === 1 ? 'Month' : 'Months'}
                </button>
              ))}
            </div>
          </div>
          
          {/* Quantity */}
          <div className="mb-6">
            <label className="block font-medium mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border rounded-full">-</button>
              <span className="text-xl w-12 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 border rounded-full">+</button>
            </div>
          </div>
          
          {/* Price Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-2"><span>Total Rent:</span><span className="font-bold">₹{totalRent}</span></div>
            <div className="flex justify-between mb-2"><span>Security Deposit:</span><span>₹{product.securityDeposit}</span></div>
            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg"><span>Total Payable:</span><span className="text-blue-600">₹{totalPayable}</span></div>
          </div>
          
          <button onClick={handleAddToCart} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailWorking;
