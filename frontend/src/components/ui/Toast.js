import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <FaCheckCircle className="text-green-500" size={20} />,
    error: <FaTimesCircle className="text-red-500" size={20} />,
    warning: <FaExclamationCircle className="text-yellow-500" size={20} />,
    info: <FaInfoCircle className="text-blue-500" size={20} />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  };

  return (
    <div className={`fixed top-20 right-4 z-50 animate-slide-in-right`}>
      <div className={`flex items-center p-4 rounded-lg shadow-lg border ${bgColors[type]} min-w-[300px] max-w-md`}>
        <div className="flex-shrink-0 mr-3">
          {icons[type]}
        </div>
        <div className={`flex-1 text-sm font-medium ${textColors[type]}`}>
          {message}
        </div>
        <button
          onClick={onClose}
          className={`ml-3 flex-shrink-0 ${textColors[type]} hover:opacity-70`}
        >
          <FaTimes size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toast;