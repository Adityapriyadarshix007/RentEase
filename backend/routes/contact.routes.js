const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect, admin } = require('../middleware/auth.middleware');

console.log('🔧 Contact routes loaded');

// Contact Schema with userId reference
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
  replyMessage: { type: String, default: '' },
  replySentAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// POST - Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, userId } = req.body;
    
    console.log(`📝 New contact message from: ${email}, UserId: ${userId || 'Not logged in'}`);
    
    const contact = new Contact({ 
      name, 
      email, 
      subject, 
      message, 
      userId: userId || null,
      status: 'unread'
    });
    await contact.save();
    
    console.log(`✅ Contact saved with ID: ${contact._id}`);
    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('❌ Error saving contact:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - User's own messages (authenticated users)
router.get('/my-messages', protect, async (req, res) => {
  try {
    console.log(`📋 Fetching messages for user ID: ${req.user._id}, Email: ${req.user.email}`);
    
    // Find messages by userId OR email
    const messages = await Contact.find({ 
      $or: [
        { userId: req.user._id },
        { email: req.user.email }
      ]
    }).sort({ createdAt: -1 });
    
    console.log(`✅ Found ${messages.length} messages for user ${req.user.email}`);
    
    // Log each message for debugging
    messages.forEach(msg => {
      console.log(`   - ${msg.subject} (${msg.status}) - Reply: ${msg.replyMessage ? 'Yes' : 'No'}`);
    });
    
    res.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching user messages:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET - All contacts (admin only)
router.get('/', protect, admin, async (req, res) => {
  console.log('📋 Admin fetching all contacts');
  const contacts = await Contact.find({}).sort({ createdAt: -1 });
  console.log(`✅ Found ${contacts.length} total contacts`);
  res.json({ success: true, contacts });
});

// PUT - Update contact (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { status, replyMessage } = req.body;
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    console.log(`✏️ Updating contact ${contact._id} - Status: ${status}, Has Reply: ${!!replyMessage}`);
    
    contact.status = status;
    if (replyMessage) {
      contact.replyMessage = replyMessage;
      contact.replySentAt = new Date();
    }
    
    await contact.save();
    console.log(`✅ Reply saved for contact ${contact._id}`);
    
    res.json({ success: true, message: 'Reply saved!', emailSent: false });
  } catch (error) {
    console.error('❌ Error updating contact:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Delete contact (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Contact deleted' });
});

module.exports = router;
