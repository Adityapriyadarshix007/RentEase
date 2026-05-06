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
      const response = await fetch('https://rentease-backend-njvk.onrender.com/api/contact', {
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

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://rentease-backend-njvk.onrender.com/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      toast.success(`Message marked as ${status}`);
      fetchContacts();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const sendReply = async (id) => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://rentease-backend-njvk.onrender.com/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: 'replied', replyMessage })
      });
      toast.success('Reply sent');
      setSelectedContact(null);
      setReplyMessage('');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to send reply');
    }
  };

  const deleteContact = async (id) => {
    if (window.confirm('Delete this message?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`https://rentease-backend-njvk.onrender.com/api/contact/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        toast.success('Message deleted');
        fetchContacts();
      } catch (error) {
        toast.error('Failed to delete');
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
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-200">
            {contacts.map((contact) => (<tr key={contact._id} className="hover:bg-gray-50"><td className="px-6 py-4 text-sm text-gray-900">{contact.name}</td><td className="px-6 py-4 text-sm text-gray-500">{contact.email}</td><td className="px-6 py-4 text-sm text-gray-500">{contact.subject}</td><td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contact.status)}`}>{contact.status}</span></td><td className="px-6 py-4 text-sm text-gray-500">{new Date(contact.createdAt).toLocaleDateString()}</td><td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => setSelectedContact(contact)} className="text-blue-600" title="View"><FaEye /></button>{contact.status !== 'read' && <button onClick={() => updateStatus(contact._id, 'read')} className="text-yellow-600" title="Mark Read"><FaCheckDouble /></button>}<button onClick={() => { setSelectedContact(contact); setReplyMessage(''); }} className="text-green-600" title="Reply"><FaReply /></button><button onClick={() => deleteContact(contact._id)} className="text-red-600" title="Delete"><FaTrash /></button></div></td></tr>))}
          </tbody>
        </table>
      </div>
      
      {selectedContact && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"><div className="flex justify-between items-start mb-4"><h2 className="text-2xl font-bold">Message Details</h2><button onClick={() => setSelectedContact(null)} className="text-gray-500 text-2xl">×</button></div><p><strong>From:</strong> {selectedContact.name} ({selectedContact.email})</p><p><strong>Subject:</strong> {selectedContact.subject}</p><p><strong>Message:</strong></p><p className="bg-gray-50 p-3 rounded mt-1">{selectedContact.message}</p><div className="border-t pt-3 mt-3"><textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} className="w-full px-4 py-2 border rounded-lg" rows="4" placeholder="Type your reply..." /><div className="flex gap-3 mt-3"><button onClick={() => updateStatus(selectedContact._id, 'read')} className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded">Mark as Read</button><button onClick={() => sendReply(selectedContact._id)} className="flex-1 bg-green-600 text-white px-4 py-2 rounded">Send Reply</button></div></div></div></div>)}
    </div>
  );
};

export default AdminContacts;
