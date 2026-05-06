import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex py-3 px-5 text-gray-700 bg-gray-100 rounded-lg mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center text-gray-700 hover:text-primary">
            <FaHome className="mr-2" />
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              {item.link ? (
                <Link to={item.link} className="text-gray-700 hover:text-primary">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-500">{item.label}</span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;