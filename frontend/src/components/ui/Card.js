import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  hoverable = false,
  padding = 'p-6'
}) => {
  const hoverClass = hoverable ? 'hover:shadow-xl transform hover:scale-105 transition-all duration-300' : '';
  
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${hoverClass} ${className}`}>
      {(title || subtitle) && (
        <div className={`${padding} ${footer ? 'border-b' : ''}`}>
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      )}
      
      <div className={padding}>
        {children}
      </div>
      
      {footer && (
        <div className={`${padding} border-t bg-gray-50`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;