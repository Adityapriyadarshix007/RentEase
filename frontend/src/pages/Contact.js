import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Hardcode the API URL for production
  const API_URL = 'https://rentease-backend-njvk.onrender.com';

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!formData.subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }
    if (!formData.message.trim()) {
      toast.error('Please enter your message');
      return;
    }
    
    setSubmitting(true);
    toast.loading('Sending message...', { id: 'contact-send' });
    
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        userId: user?._id || null
      };
      
      console.log('Sending to:', `${API_URL}/api/contact`);
      console.log('Payload:', { ...payload, message: '***' });
      
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      console.log('Response:', data);
      
      toast.dismiss('contact-send');
      
      if (response.ok) {
        toast.success('✅ Message sent successfully! We will respond within 24 hours.');
        setFormData(prev => ({ 
          ...prev, 
          subject: '', 
          message: '',
          name: user?.name || '',
          email: user?.email || ''
        }));
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    } catch (error) {
      toast.dismiss('contact-send');
      console.error('Error:', error);
      toast.error('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: <FaMapMarkerAlt className="text-primary text-2xl" />, title: 'Visit Us', details: ['123 Business Park', 'Mumbai, Maharashtra 400001', 'India'] },
    { icon: <FaPhone className="text-primary text-2xl" />, title: 'Call Us', details: ['+91 1234567890', '+91 9876543210'] },
    { icon: <FaEnvelope className="text-primary text-2xl" />, title: 'Email Us', details: ['support@rentease.com', 'sales@rentease.com'] },
    { icon: <FaClock className="text-primary text-2xl" />, title: 'Working Hours', details: ['Monday - Friday: 9 AM - 8 PM', 'Saturday: 10 AM - 6 PM', 'Sunday: Closed'] }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-gray-600">We'd love to hear from you. Get in touch with us for any queries.</p>
        {user && (
          <p className="text-sm text-green-600 mt-2">
            ✓ Logged in as {user.email}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Your Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                  placeholder="Enter your name"
                  required 
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email Address *</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                  placeholder="your@email.com"
                  required 
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Subject *</label>
                <input 
                  type="text" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                  placeholder="What is this regarding?"
                  required 
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Message *</label>
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  rows="5" 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                  placeholder="Please provide details about your inquiry..."
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={submitting} 
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="space-y-6">
          {contactInfo.map((info, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">{info.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{info.title}</h3>
                  {info.details.map((detail, i) => (<p key={i} className="text-gray-600">{detail}</p>))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
