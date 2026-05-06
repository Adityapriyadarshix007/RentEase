import React, { useState, useEffect } from 'react';
import { FaEye, FaCheckDouble, FaReply, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/contact', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (contactId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/contact/${contactId}`, {
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
      toast.error('Failed to update status');
    }
  };

  const sendReply = async (contactId) => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/contact/${contactId}`, {
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

      if (response.ok) {
        toast.success('Reply sent successfully');
        setSelectedContact(null);
        setReplyMessage('');
        fetchContacts();
      } else {
        toast.error('Failed to send reply');
      }
    } catch (error) {
      toast.error('Failed to send reply');
    }
  };

  const deleteContact = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5001/api/contact/${contactId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          toast.success('Message deleted successfully');
          fetchContacts();
        } else {
          toast.error('Failed to delete message');
        }
      } catch (error) {
        toast.error('Failed to delete message');
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'unread': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-8 text-center">Loading messages...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Contact Messages</h1>
      
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
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedContact(contact)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      {contact.status !== 'read' && (
                        <button
                          onClick={() => updateContactStatus(contact._id, 'read')}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Mark as Read"
                        >
                          <FaCheckDouble />
                        </button>
                      )}
                      {contact.status !== 'replied' && (
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="text-green-600 hover:text-green-800"
                          title="Reply"
                        >
                          <FaReply />
                        </button>
                      )}
                      <button
                        onClick={() => deleteContact(contact._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {contacts.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No messages found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View/Reply Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Message Details</h2>
              <button onClick={() => setSelectedContact(null)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            
            <div className="space-y-3">
              <p><strong>From:</strong> {selectedContact.name} ({selectedContact.email})</p>
              <p><strong>Subject:</strong> {selectedContact.subject}</p>
              <p><strong>Date:</strong> {new Date(selectedContact.createdAt).toLocaleString()}</p>
              <p><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedContact.status)}`}>
                  {selectedContact.status}
                </span>
              </p>
              <div className="border-t pt-3">
                <p><strong>Message:</strong></p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded mt-1">{selectedContact.message}</p>
              </div>
              
              {/* Reply Section */}
              <div className="border-t pt-3">
                <p><strong>Reply to {selectedContact.name}:</strong></p>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg mt-2"
                  rows="4"
                  placeholder="Type your reply here..."
                />
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => updateContactStatus(selectedContact._id, 'read')}
                    className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                  >
                    Mark as Read
                  </button>
                  <button
                    onClick={() => sendReply(selectedContact._id)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
