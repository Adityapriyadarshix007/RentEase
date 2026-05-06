import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-primary">RentEase</h3>
            <p className="text-gray-400 mb-4">
              Making furniture and appliance rental easy, affordable, and flexible for everyone.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition text-xl">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition text-xl">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition text-xl">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition text-xl">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-400 hover:text-primary transition">Products</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-primary transition">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-primary transition">Contact</Link></li>
              <li><Link to="/faqs" className="text-gray-400 hover:text-primary transition">FAQs</Link></li>
            </ul>
          </div>

          {/* Support & Policies */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-400 hover:text-primary transition">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-primary transition">Privacy Policy</Link></li>
              <li><Link to="/refund" className="text-gray-400 hover:text-primary transition">Refund Policy</Link></li>
              <li><Link to="/cancellation" className="text-gray-400 hover:text-primary transition">Cancellation Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info - Direct Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              {/* Address - Opens Google Maps */}
              <li className="flex items-center space-x-3 text-gray-400">
                <FaMapMarkerAlt className="text-primary" />
                <a 
                  href="https://maps.google.com/?q=123+Business+Park+Mumbai+India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition"
                >
                  123 Business Park, Mumbai, India
                </a>
              </li>
              
              {/* Phone - Opens phone dialer */}
              <li className="flex items-center space-x-3 text-gray-400">
                <FaPhone className="text-primary" />
                <a 
                  href="tel:+911234567890"
                  className="hover:text-primary transition"
                >
                  +91 1234567890
                </a>
              </li>
              
              {/* Email - Opens email client */}
              <li className="flex items-center space-x-3 text-gray-400">
                <FaEnvelope className="text-primary" />
                <a 
                  href="mailto:support@rentease.com?subject=Inquiry%20from%20RentEase%20Website&body=Hello%20RentEase%20Team%2C%0D%0A%0D%0AI%20have%20a%20question%20about%3A%0D%0A%0D%0A%0D%0AThank%20you."
                  className="hover:text-primary transition"
                >
                  support@rentease.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} RentEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
