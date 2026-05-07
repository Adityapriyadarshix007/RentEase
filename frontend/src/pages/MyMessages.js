import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaCheckCircle, FaClock } from 'react-icons/fa';

const MyMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchMyMessages();
  }, []);

  const fetchMyMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://rentease-backend-njvk.onrender.com/api/contact/my-messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'replied') {
      return <span className="flex items-center gap-1 text-green-600"><FaCheckCircle /> Replied</span>;
    }
    if (status === 'read') {
      return <span className="flex items-center gap-1 text-blue-600"><FaClock /> Read</span>;
    }
    return <span className="flex items-center gap-1 text-yellow-600"><FaEnvelope /> Pending</span>;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (messages.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">📧</div>
        <h2 className="text-2xl font-bold mb-4">No Messages</h2>
        <p className="text-gray-600 mb-6">You haven't sent any messages to support yet.</p>
        <a href="/contact" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Contact Support</a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Messages</h1>
      <p className="text-gray-600 mb-6">Track your support requests and see responses from our team.</p>
      
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-semibold">{msg.subject}</h3>
                <p className="text-sm text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</p>
              </div>
              {getStatusBadge(msg.status)}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-3">
              <p className="text-gray-700">{msg.message}</p>
            </div>
            
            {msg.replyMessage && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="font-semibold text-blue-800 mb-2">📝 Support Response:</p>
                <p className="text-gray-700">{msg.replyMessage}</p>
                {msg.replySentAt && (
                  <p className="text-xs text-gray-500 mt-2">Replied on: {new Date(msg.replySentAt).toLocaleDateString()}</p>
                )}
              </div>
            )}
            
            {msg.status === 'unread' && (
              <p className="text-sm text-yellow-600 mt-3">⏳ Awaiting response from support team.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyMessages;
