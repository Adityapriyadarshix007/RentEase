import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/index';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';
import { FaTruck, FaShieldAlt, FaClock, FaHands, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productService.getFeatured();
      setFeaturedProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FaTruck className="text-4xl text-primary" />,
      title: 'Free Delivery',
      description: 'Free delivery and pickup on all rentals within city limits'
    },
    {
      icon: <FaShieldAlt className="text-4xl text-primary" />,
      title: 'Secure Deposits',
      description: '100% secure deposit protection with easy refund process'
    },
    {
      icon: <FaClock className="text-4xl text-primary" />,
      title: 'Flexible Tenure',
      description: 'Choose from 1, 3, 6, or 12 months rental plans'
    },
    {
      icon: <FaHands className="text-4xl text-primary" />,
      title: 'Easy Maintenance',
      description: 'Quick support and maintenance service within 24 hours'
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-12 mb-12">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold mb-4">
            Rent Furniture & Appliances
          </h1>
          <p className="text-xl mb-6">
            Flexible monthly rentals for your home and office needs. Save money, reduce waste, and enjoy hassle-free living.
          </p>
          <Link to="/products" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 inline-block">
            Explore Products
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose RentEase?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-primary hover:underline flex items-center">
            View All <FaArrowRight className="ml-2" />
          </Link>
        </div>
        
        {loading ? (
          <Loader />
        ) : featuredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
