import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AdminContactsTest = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'https://rentease-backend-njvk.onrender.com';

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (error) {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const testReply = async (id, email) => {
    toast.loading('Testing...');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'replied',
          replyMessage: `Test reply sent at ${new Date().toLocaleString()}`
        })
      });
      
      const data = await response.json();
      toast.dismiss();
      
      if (response.ok) {
        toast.success(`Success! Email sent: ${data.emailSent}`);
      } else {
        toast.error(`Failed: ${data.message}`);
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Network error');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Contact Replies</h1>
      <div className="space-y-4">
        {contacts.map((contact) => (
          <div key={contact._id} className="border p-4 rounded">
            <p><strong>From:</strong> {contact.name} ({contact.email})</p>
            <p><strong>Subject:</strong> {contact.subject}</p>
            <p><strong>Message:</strong> {contact.message.substring(0, 100)}</p>
            <p><strong>Status:</strong> {contact.status}</p>
            <button 
              onClick={() => testReply(contact._id, contact.email)}
              className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
            >
              Test Reply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminContactsTest;
