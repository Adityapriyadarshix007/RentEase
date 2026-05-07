const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect, admin } = require('../middleware/auth.middleware');

console.log('🔧 Contact routes loaded');

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: String, email: String, subject: String, message: String,
  status: { type: String, default: 'unread' },
  replyMessage: String, replySentAt: Date, createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// POST - Submit contact form
router.post('/', async (req, res) => {
  console.log('📝 POST /api/contact received');
  try {
    const { name, email, subject, message } = req.body;
    const contact = new Contact({ name, email, subject, message });
    await contact.save();
    console.log('✅ Contact saved:', contact._id);
    res.status(201).json({ success: true, message: 'Message sent!' });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - All contacts (admin only)
router.get('/', protect, admin, async (req, res) => {
  console.log('📋 GET /api/contact - Admin access');
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Update contact (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  console.log('✏️ PUT /api/contact/:id - Admin access');
  try {
    const { status, replyMessage } = req.body;
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    
    console.log(`Updating contact ${contact._id} to status: ${status}`);
    if (replyMessage) {
      console.log(`Reply message: "${replyMessage.substring(0, 50)}..."`);
    }
    
    contact.status = status;
    if (replyMessage) {
      contact.replyMessage = replyMessage;
      contact.replySentAt = new Date();
    }
    await contact.save();
    
    res.json({ success: true, message: 'Reply saved!', emailSent: false });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Delete contact (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  console.log('🗑️ DELETE /api/contact/:id');
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
