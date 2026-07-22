import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const GoogleAuthHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { googleLogin } = useAuth();

  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleGoogleLogin = async () => {
      if (hasProcessed.current) return;
      hasProcessed.current = true;

      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get('token');
      const error = urlParams.get('error');

      console.log('Google Auth Handler');
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('Error:', error);
      console.log('Current URL:', window.location.href);

      if (token) {
        try {
          // Update AuthContext, fetch user, set axios header
          const success = await googleLogin(token);

          if (success) {
            // Remove token from URL
            window.history.replaceState({}, document.title, '/google-auth');

            navigate('/products', { replace: true });
          } else {
            toast.error('Google login failed.');
            navigate('/login', { replace: true });
          }
        } catch (err) {
          console.error(err);
          toast.error('Google authentication failed.');
          navigate('/login', { replace: true });
        }

        return;
      }

      if (error) {
        toast.error('Google authentication failed.');
        navigate('/login', { replace: true });
        return;
      }

      // If user already has a token
      const existingToken = localStorage.getItem('token');

      if (existingToken) {
        navigate('/products', { replace: true });
      } else {
        toast.error('Authentication failed. No token received.');
        navigate('/login', { replace: true });
      }
    };

    handleGoogleLogin();
  }, [location, navigate, googleLogin]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
        ></div>

        <h2 className="mt-4 text-lg font-semibold">
          Completing Google Sign In...
        </h2>

        <p className="text-gray-500 mt-2">
          Please wait while we securely sign you in.
        </p>
      </div>
    </div>
  );
};

export default GoogleAuthHandler;