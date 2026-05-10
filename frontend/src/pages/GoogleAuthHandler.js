import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const GoogleAuthHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    
    console.log('Google Auth Handler - Token:', token ? 'Present' : 'Missing');
    console.log('Current URL:', window.location.href);
    
    if (token) {
      // Store token
      localStorage.setItem('token', token);
      toast.success('Successfully logged in with Google!');
      
      // Redirect to products page
      navigate('/products');
    } else if (error) {
      toast.error('Google authentication failed. Please try again.');
      navigate('/login');
    } else {
      // Check if already logged in
      const existingToken = localStorage.getItem('token');
      if (existingToken) {
        navigate('/products');
      } else {
        toast.error('Authentication failed. No token received.');
        navigate('/login');
      }
    }
  }, [location, navigate]);

  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing Google authentication...</p>
      </div>
    </div>
  );
};

export default GoogleAuthHandler;
