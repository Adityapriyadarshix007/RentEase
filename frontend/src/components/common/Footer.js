import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to handle email click
  const handleEmailClick = () => {
    window.location.href = 'mailto:support@rentease.com?subject=Inquiry from RentEase Website&body=Hello RentEase Team,%0D%0A%0D%0AI have a question about:%0D%0A%0D%0A%0D%0AThank you.';
  };

  // Function to handle phone click
  const handlePhoneClick = () => {
    window.location.href = 'tel:+911234567890';
  };

  // Function to handle address click (opens Google Maps)
  const handleAddressClick = () => {
    window.open('https://maps.google.com/?q=123+Business+Park+Mumbai+India', '_blank');
  };

  return (
    <footer className="mt-auto bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-blue-400">RentEase</h3>
            <p className="text-gray-400 mb-4">
              Making furniture and appliance rental easy, affordable, and flexible for everyone.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.55 0 .36.04.7.13 1.03-3.78-.2-7.14-2-9.38-4.74-.4.7-.6 1.5-.6 2.3 0 1.56.8 2.93 2 3.74-.73-.02-1.44-.24-2.05-.6v.06c0 2.17 1.55 4 3.6 4.4-.38.1-.78.15-1.18.15-.28 0-.56-.03-.83-.08.56 1.77 2.2 3.06 4.14 3.1-1.5 1.2-3.4 1.9-5.47 1.9-.35 0-.7-.02-1.05-.07 1.95 1.24 4.26 1.96 6.77 1.96 8.1 0 12.5-6.7 12.5-12.5 0-.2-.02-.4-.04-.6.86-.62 1.6-1.4 2.2-2.3z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.22.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.05.41 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.22-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.05.36-2.22.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.22-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.05-.41-2.22-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.36 2.22-.41 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.34 4.13.66c-.84.34-1.55.8-2.26 1.5-.7.7-1.16 1.42-1.5 2.26-.32.77-.53 1.65-.59 2.92C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.27 2.15.59 2.92.34.84.8 1.55 1.5 2.26.7.7 1.42 1.16 2.26 1.5.77.32 1.65.53 2.92.59C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.27 2.92-.59.84-.34 1.55-.8 2.26-1.5.7-.7 1.16-1.42 1.5-2.26.32-.77.53-1.65.59-2.92.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.27-2.15-.59-2.92-.34-.84-.8-1.55-1.5-2.26-.7-.7-1.42-1.16-2.26-1.5-.77-.32-1.65-.53-2.92-.59C15.67.01 15.26 0 12 0z m0 5.84c-3.4 0-6.16 2.76-6.16 6.16s2.76 6.16 6.16 6.16 6.16-2.76 6.16-6.16-2.76-6.16-6.16-6.16z m0 10.16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z m6.4-11.46c0 .8-.64 1.44-1.44 1.44-.8 0-1.44-.64-1.44-1.44 0-.8.64-1.44 1.44-1.44.8 0 1.44.64 1.44 1.44z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.45 20.45h-3.6v-5.56c0-1.32-.02-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.93v5.65h-3.6V9.3h3.45v1.52h.05c.48-.91 1.66-1.87 3.4-1.87 3.64 0 4.31 2.4 4.31 5.52v5.98zM5.34 7.74c-1.16 0-2.1-.94-2.1-2.1s.94-2.1 2.1-2.1 2.1.94 2.1 2.1-.94 2.1-2.1 2.1zM7.12 20.45h-3.6V9.3h3.6v11.15z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleNavigation('/products')} 
                  className="text-gray-400 hover:text-blue-400 transition cursor-pointer"
                >
                  Products
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/about')} 
                  className="text-gray-400 hover:text-blue-400 transition cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/contact')} 
                  className="text-gray-400 hover:text-blue-400 transition cursor-pointer"
                >
                  Contact
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/faqs')} 
                  className="text-gray-400 hover:text-blue-400 transition cursor-pointer"
                >
                  FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Policies */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleNavigation('/terms')} 
                  className="text-gray-400 hover:text-blue-400 transition cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/privacy')} 
                  className="text-gray-400 hover:text-blue-400 transition cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/refund')} 
                  className="text-gray-400 hover:text-blue-400 transition cursor-pointer"
                >
                  Refund Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/cancellation')} 
                  className="text-gray-400 hover:text-blue-400 transition cursor-pointer"
                >
                  Cancellation Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info - Clickable */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              {/* Address - Opens Google Maps */}
              <li>
                <button 
                  onClick={handleAddressClick}
                  className="flex items-center space-x-3 text-gray-400 hover:text-blue-400 transition cursor-pointer w-full text-left"
                >
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>123 Business Park, Mumbai, India</span>
                </button>
              </li>
              
              {/* Phone - Opens phone dialer */}
              <li>
                <button 
                  onClick={handlePhoneClick}
                  className="flex items-center space-x-3 text-gray-400 hover:text-blue-400 transition cursor-pointer w-full text-left"
                >
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+91 1234567890</span>
                </button>
              </li>
              
              {/* Email - Opens email client */}
              <li>
                <button 
                  onClick={handleEmailClick}
                  className="flex items-center space-x-3 text-gray-400 hover:text-blue-400 transition cursor-pointer w-full text-left"
                >
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@rentease.com</span>
                </button>
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
