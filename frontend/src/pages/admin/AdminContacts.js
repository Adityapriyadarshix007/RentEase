import React, { useState, useEffect } from 'react';
import { FaEye, FaCheckDouble, FaReply, FaTrash, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);

  // HARDCODED LIVE BACKEND URL - NO localhost
  const API_BASE_URL = 'https://rentease-backend-njvk.onrender.com';

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login again');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/contact/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        toast.success(`Message marked as ${status}`);
        fetchContacts();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Network error');
    }
  };

  const sendReply = async (id) => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }
    
    setSending(true);
    toast.loading('Sending reply and email...');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login again');
        setSending(false);
        return;
      }
      
      console.log('Sending to:', `${API_BASE_URL}/api/contact/${id}`);
      
      const response = await fetch(`${API_BASE_URL}/api/contact/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: 'replied', 
          replyMessage: replyMessage 
        })
      });
      
      const data = await response.json();
      toast.dismiss();
      
      if (response.ok) {
        if (data.emailSent) {
          toast.success('✅ Reply sent! Email delivered to user.');
        } else {
          toast.success('✅ Reply saved! (Email notification skipped)');
        }
        setSelectedContact(null);
        setReplyMessage('');
        fetchContacts();
      } else {
        toast.error('Failed to save reply: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      toast.dismiss();
      console.error('Reply error:', error);
      toast.error('Network error. Could not send reply.');
    } finally {
      setSending(false);
    }
  };

  const deleteContact = async (id) => {
    if (window.confirm('Delete this message?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/contact/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          toast.success('Message deleted');
          fetchContacts();
        } else {
          toast.error('Failed to delete');
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Network error');
      }
    }
  };

  const getStatusColor = (status) => {
    if (status === 'unread') return 'bg-red-100 text-red-800';
    if (status === 'read') return 'bg-yellow-100 text-yellow-800';
    if (status === 'replied') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="p-8 text-center">Loading messages...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Contact Messages</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
        <FaEnvelope className="text-blue-500 text-2xl" />
        <div>
          <p className="font-semibold text-blue-800">Email Notifications Active</p>
          <p className="text-sm text-blue-600">When you reply, an email will be sent to the user automatically.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr key={contact._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{contact.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{contact.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{contact.subject}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                    {contact.status === 'replied' && (
                      <span className="ml-2 text-xs text-green-600">(Email sent)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedContact(contact)} className="text-blue-600 hover:text-blue-800" title="View">
                        <FaEye />
                      </button>
                      {contact.status === 'unread' && (
                        <button onClick={() => updateStatus(contact._id, 'read')} className="text-yellow-600 hover:text-yellow-800" title="Mark Read">
                          <FaCheckDouble />
                        </button>
                      )}
                      <button 
                        onClick={() => { setSelectedContact(contact); setReplyMessage(''); }} 
                        className="text-green-600 hover:text-green-800" 
                        title="Send Reply"
                      >
                        <FaReply />
                      </button>
                      <button onClick={() => deleteContact(contact._id)} className="text-red-600 hover:text-red-800" title="Delete">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Reply to {selectedContact.name}</h2>
              <button onClick={() => setSelectedContact(null)} className="text-gray-500 text-2xl hover:text-gray-700">×</button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>From:</strong> {selectedContact.name} ({selectedContact.email})</p>
                <p><strong>Subject:</strong> {selectedContact.subject}</p>
                <p><strong>Message:</strong></p>
                <p className="text-gray-700 mt-1 bg-white p-3 rounded">{selectedContact.message}</p>
              </div>
              
              <div>
                <label className="block font-medium mb-2">Your Reply *</label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="6"
                  placeholder="Type your reply here... This will be emailed to the user."
                  disabled={sending}
                />
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <FaEnvelope className="text-blue-500" /> This reply will be emailed to {selectedContact.email}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedContact(null)} 
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  disabled={sending}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => sendReply(selectedContact._id)} 
                  disabled={sending || !replyMessage.trim()}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send Reply & Email'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
