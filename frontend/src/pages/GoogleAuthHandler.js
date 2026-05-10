import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const GoogleAuthHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, needsProfileCompletion } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    
    console.log('Google Auth Handler - Token:', token ? 'Present' : 'Missing');
    
    if (token) {
      localStorage.setItem('token', token);
      toast.success('Successfully logged in with Google!');
      
      // Small delay to ensure user data is loaded
      setTimeout(() => {
        if (needsProfileCompletion()) {
          navigate('/complete-profile');
        } else {
          navigate('/products');
        }
      }, 500);
    } else if (error === 'google_auth_failed') {
      toast.error('Google authentication failed. Please try again.');
      navigate('/login');
    } else {
      toast.error('Authentication failed. No token received.');
      navigate('/login');
    }
  }, [location, navigate, needsProfileCompletion]);

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
