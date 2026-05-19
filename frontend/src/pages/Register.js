import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (formData.phone.length !== 10) {
      toast.error('Phone number must be 10 digits');
      return;
    }
    
    if (formData.address.pincode.length !== 6) {
      toast.error('Pincode must be 6 digits');
      return;
    }
    
    setLoading(true);
    const { confirmPassword, ...registerData } = formData;
    const success = await register(registerData);
    setLoading(false);
    
    if (success) {
      navigate('/products');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="mt-2 text-gray-600">Join RentEase and start renting today</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Email Address *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="john@example.com" />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Phone Number *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" placeholder="9876543210" />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Password *</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                  placeholder="••••••••" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Confirm Password *</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                  placeholder="••••••••" 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                >
                  {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4 mt-2">Address Information</h3>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Street Address *</label>
              <input type="text" name="address.street" value={formData.address.street} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" placeholder="123 Main Street" />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">City *</label>
              <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" placeholder="Mumbai" />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">State *</label>
              <input type="text" name="address.state" value={formData.address.state} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" placeholder="Maharashtra" />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Pincode *</label>
              <input type="text" name="address.pincode" value={formData.address.pincode} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" placeholder="400001" maxLength="6" />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Landmark</label>
              <input type="text" name="address.landmark" value={formData.address.landmark} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="Near City Mall" />
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button type="button" onClick={() => navigate('/login')} className="text-blue-600 hover:underline">
              Sign in here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
