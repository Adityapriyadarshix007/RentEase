import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaTachometerAlt, FaBars, FaTimes, FaHome, FaEnvelope } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const cartCount = getCartCount();

  // Fetch unread message count
  const fetchUnreadCount = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://rentease-backend-njvk.onrender.com/api/contact/my-messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      const messages = data.messages || [];
      const count = messages.filter(msg => 
        msg.status === 'unread' || (msg.status === 'read' && !msg.replyMessage)
      ).length;
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      // Refresh count every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsDropdownOpen(false);
  };

  const handleNavigation = (path) => {
    if (path === '/my-messages') {
      setUnreadCount(0);
    }
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={user ? "/products" : "/login"} className="flex items-center space-x-2 group cursor-pointer">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg transform group-hover:scale-105 transition duration-200">
              <FaHome className="text-white text-xl" />
            </div>
            <div>
              <span className="text-2xl font-bold text-blue-600">Rent</span>
              <span className="text-2xl font-bold text-gray-800">Ease</span>
              <p className="text-xs text-gray-500 hidden sm:block">Rent with Ease</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user && (
              <>
                <Link to="/products" className={`text-gray-700 hover:text-blue-600 transition font-medium ${isActive('/products') ? 'text-blue-600' : ''}`}>Products</Link>
                <Link to="/my-rentals" className={`text-gray-700 hover:text-blue-600 transition font-medium ${isActive('/my-rentals') ? 'text-blue-600' : ''}`}>My Rentals</Link>
                <Link to="/maintenance" className={`text-gray-700 hover:text-blue-600 transition font-medium ${isActive('/maintenance') ? 'text-blue-600' : ''}`}>Support</Link>
              </>
            )}
            <Link to="/about" className={`text-gray-700 hover:text-blue-600 transition font-medium ${isActive('/about') ? 'text-blue-600' : ''}`}>About</Link>
            <Link to="/contact" className={`text-gray-700 hover:text-blue-600 transition font-medium ${isActive('/contact') ? 'text-blue-600' : ''}`}>Contact</Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {user && (
              <Link to="/cart" className="relative hover:opacity-80 transition cursor-pointer">
                <FaShoppingCart className="text-2xl text-gray-700 hover:text-blue-600 transition" />
                {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">{cartCount}</span>}
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button
                  ref={buttonRef}
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                >
                  <FaUser />
                  <span className="hidden sm:inline">{user.name?.split(' ')[0] || 'User'}</span>
                </button>
                
                {isDropdownOpen && (
                  <div 
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border animate-fade-in"
                  >
                    <button onClick={() => handleNavigation('/profile')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition cursor-pointer">
                      <FaUser className="inline mr-2" /> Profile
                    </button>
                    <button onClick={() => handleNavigation('/my-messages')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition cursor-pointer relative">
                      <FaEnvelope className="inline mr-2" /> My Messages
                      {unreadCount > 0 && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center animate-pulse">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </button>
                    {user.role === 'admin' && (
                      <button onClick={() => handleNavigation('/admin')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition cursor-pointer">
                        <FaTachometerAlt className="inline mr-2" /> Dashboard
                      </button>
                    )}
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition cursor-pointer">
                      <FaSignOutAlt className="inline mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">Login</button>
            )}

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-700 hover:text-blue-600 transition cursor-pointer">
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              {user && (
                <>
                  <button onClick={() => handleNavigation('/products')} className="text-gray-700 hover:text-blue-600 transition py-2 text-left cursor-pointer">Products</button>
                  <button onClick={() => handleNavigation('/my-rentals')} className="text-gray-700 hover:text-blue-600 transition py-2 text-left cursor-pointer">My Rentals</button>
                  <button onClick={() => handleNavigation('/maintenance')} className="text-gray-700 hover:text-blue-600 transition py-2 text-left cursor-pointer">Support</button>
                </>
              )}
              <button onClick={() => handleNavigation('/about')} className="text-gray-700 hover:text-blue-600 transition py-2 text-left cursor-pointer">About</button>
              <button onClick={() => handleNavigation('/contact')} className="text-gray-700 hover:text-blue-600 transition py-2 text-left cursor-pointer">Contact</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
