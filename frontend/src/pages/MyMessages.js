import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaCheckCircle, FaClock, FaReply } from 'react-icons/fa';

const MyMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchMyMessages();
  }, []);

  const fetchMyMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view your messages');
        setLoading(false);
        return;
      }
      
      const response = await fetch('https://rentease-backend-njvk.onrender.com/api/contact/my-messages', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setMessages(data.messages || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status, hasReply) => {
    if (hasReply) {
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

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button onClick={fetchMyMessages} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">📧</div>
        <h2 className="text-2xl font-bold mb-4">No Messages</h2>
        <p className="text-gray-600 mb-6">You haven't sent any messages to support yet.</p>
        <a href="/contact" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Contact Support
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">My Messages</h1>
      <p className="text-gray-600 mb-6">You have {messages.length} message(s).</p>
      
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-semibold">{msg.subject}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </p>
              </div>
              {getStatusBadge(msg.status, msg.replyMessage && msg.replyMessage.length > 0)}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-3">
              <p className="text-sm text-gray-500 mb-1">Your Message:</p>
              <p className="text-gray-700">{msg.message}</p>
            </div>
            
            {msg.replyMessage && msg.replyMessage.length > 0 && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <FaReply /> Support Response:
                </p>
                <p className="text-gray-700">{msg.replyMessage}</p>
                {msg.replySentAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    Replied on: {new Date(msg.replySentAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
            
            {(!msg.replyMessage || msg.replyMessage.length === 0) && msg.status !== 'replied' && (
              <p className="text-sm text-yellow-600 mt-3">⏳ Awaiting response from support team.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyMessages;
