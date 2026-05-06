const mongoose = require('mongoose');

let Contact;
try {
  Contact = require('../models/Contact.model');
} catch (error) {
  const contactSchema = new mongoose.Schema({
    name: String, email: String, subject: String, message: String,
    status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
    replyMessage: String, replySentAt: Date, createdAt: { type: Date, default: Date.now }
  });
  Contact = mongoose.model('Contact', contactSchema);
}

const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    const contact = new Contact({ name, email, subject, message, status: 'unread' });
    await contact.save();
    
    console.log('New contact message from:', email);
    res.status(201).json({ success: true, message: 'Message sent successfully! We will respond within 24 hours.' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllContacts = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateContactStatus = async (req, res) => {
  try {
    const { status, replyMessage } = req.body;
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    
    contact.status = status;
    
    if (replyMessage) {
      contact.replyMessage = replyMessage;
      contact.replySentAt = new Date();
    }
    
    await contact.save();
    
    console.log(`Contact ${contact._id} updated to status: ${status}`);
    res.json({ 
      success: true, 
      message: replyMessage ? 'Reply saved successfully!' : 'Status updated successfully!'
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitContact,
  getAllContacts,
  updateContactStatus,
  deleteContact
};
