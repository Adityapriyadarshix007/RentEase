const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.middleware');
const mongoose = require('mongoose');

// Contact model
let Contact;
try {
  Contact = require('../models/Contact.model');
} catch (error) {
  const contactSchema = new mongoose.Schema({
    name: String, email: String, subject: String, message: String,
    status: { type: String, default: 'unread' },
    replyMessage: String, replySentAt: Date, createdAt: { type: Date, default: Date.now }
  });
  Contact = mongoose.model('Contact', contactSchema);
}

// Submit contact form (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    const contact = new Contact({ name, email, subject, message });
    await contact.save();
    
    console.log('New contact from:', email);
    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all contacts (admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update contact (admin only)
router.put('/:id', protect, admin, async (req, res) => {
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
    res.json({ success: true, message: 'Contact updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete contact (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
