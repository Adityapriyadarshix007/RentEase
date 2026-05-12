import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, FaUsers, FaBox, FaCalendarCheck, 
  FaWrench, FaTags, FaChartLine, FaImage, FaEnvelope 
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', name: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/admin/users', name: 'Users', icon: <FaUsers /> },
    { path: '/admin/products', name: 'Products', icon: <FaBox /> },
    { path: '/admin/rentals', name: 'Rentals', icon: <FaCalendarCheck /> },
    { path: '/admin/maintenance', name: 'Maintenance', icon: <FaWrench /> },
    { path: '/admin/categories', name: 'Categories', icon: <FaTags /> },
    { path: '/admin/analytics', name: 'Analytics', icon: <FaChartLine /> },
    { path: '/admin/contacts', name: 'Contacts', icon: <FaEnvelope /> },
  ];

  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex-shrink-0 min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold text-blue-400 mb-6">Admin Panel</h2>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
