import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback
} from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const API_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // ==========================
  // Fetch Logged-in User
  // ==========================
  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/profile`);

      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);

      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];

      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // ==========================
  // Restore Login on Refresh
  // ==========================
  useEffect(() => {

    if (token) {
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token}`;

      fetchUser();
    } else {
      setLoading(false);
    }

  }, [token, fetchUser]);

  // ==========================
  // Email Login
  // ==========================
  const login = async (email, password) => {
    try {

      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email,
          password
        }
      );

      const { token, ...userData } = response.data;

      localStorage.setItem('token', token);

      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token}`;

      setToken(token);
      setUser(userData);

      toast.success('Welcome back! Login successful.');

      return true;

    } catch (error) {

      toast.error(
        error.response?.data?.message || 'Login failed'
      );

      return false;
    }
  };

  // ==========================
  // Google Login
  // ==========================
  const googleLogin = async (googleToken) => {
    try {

      localStorage.setItem('token', googleToken);

      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${googleToken}`;

      setToken(googleToken);

      const response = await axios.get(
        `${API_URL}/api/auth/profile`
      );

      setUser(response.data);

      toast.success('Successfully logged in with Google!');

      return true;

    } catch (error) {

      console.error(error);

      localStorage.removeItem('token');

      delete axios.defaults.headers.common['Authorization'];

      setToken(null);
      setUser(null);

      toast.error('Google login failed');

      return false;
    }
  };

  // ==========================
  // Register
  // ==========================
  const register = async (userData) => {

    try {

      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        userData
      );

      const { token, ...userInfo } = response.data;

      localStorage.setItem('token', token);

      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token}`;

      setToken(token);
      setUser(userInfo);

      toast.success('Account created successfully!');

      return true;

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        'Registration failed'
      );

      return false;
    }
  };

  // ==========================
  // Logout
  // ==========================
  const logout = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('rentease_cart_backup');

    delete axios.defaults.headers.common['Authorization'];

    setToken(null);
    setUser(null);

    toast.success('Logged out successfully');
  };

  // ==========================
  // Update Profile
  // ==========================
  const updateProfile = async (profileData) => {

    try {

      const response = await axios.put(
        `${API_URL}/api/auth/profile`,
        profileData
      );

      setUser(prev => ({
        ...prev,
        ...response.data
      }));

      toast.success('Profile updated successfully');

      return true;

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        'Failed to update profile'
      );

      return false;
    }
  };

  // ==========================
  // Google Profile Completion
  // ==========================
  const needsProfileCompletion = () => {

    if (!user) return false;

    return (
      !user.phone ||
      !user.address?.street ||
      !user.address?.city
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        login,
        googleLogin,
        register,
        logout,
        updateProfile,
        fetchUser,
        needsProfileCompletion
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};