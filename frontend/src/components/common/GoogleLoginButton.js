import React from 'react';
import { FaGoogle } from 'react-icons/fa';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    const backendUrl = process.env.REACT_APP_API_URL || 'https://rentease-backend-njvk.onrender.com';
    // Store current page to redirect back after login
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
    >
      <FaGoogle className="text-red-500" size={18} />
      <span>Continue with Google</span>
    </button>
  );
};

export default GoogleLoginButton;
