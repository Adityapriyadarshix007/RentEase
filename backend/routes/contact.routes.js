const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect, admin } = require('../middleware/auth.middleware');

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'unread' },
  replyMessage: String,
  replySentAt: Date,
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// POST - Submit contact form (public)
router.post('/', async (req, res) => {
  try {
    console.log('📧 Contact submission received:', req.body);
    
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    
    const contact = new Contact({ name, email, subject, message });
    await contact.save();
    
    console.log('✅ Contact saved:', contact._id);
    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });
  } catch (error) {
    console.error('❌ Error saving contact:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// GET - All contacts (admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT - Update contact (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { status, replyMessage } = req.body;
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    contact.status = status;
    if (replyMessage) {
      contact.replyMessage = replyMessage;
      contact.replySentAt = new Date();
    }
    
    await contact.save();
    
    console.log(`✅ Contact ${contact._id} updated to status: ${status}`);
    res.json({ 
      success: true, 
      message: 'Reply saved successfully!',
      emailSent: false // Email feature disabled for now
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Delete contact (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
