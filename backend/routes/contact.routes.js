const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect, admin } = require('../middleware/auth.middleware');

console.log('🔧 Contact routes loaded');

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: String, email: String, subject: String, message: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
  replyMessage: { type: String, default: '' },
  replySentAt: Date,
  userHasReadReply: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// POST - Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, userId } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    const contact = new Contact({ name, email, subject, message, userId: userId || null });
    await contact.save();
    console.log('✅ Contact saved:', contact._id);
    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - User's own messages (only for authenticated users)
router.get('/my-messages', protect, async (req, res) => {
  try {
    const messages = await Contact.find({ 
      $or: [
        { userId: req.user._id },
        { email: req.user.email }
      ]
    }).sort({ createdAt: -1 });
    
    res.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching user messages:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET - Unread count (messages with new replies that user hasn't seen)
router.get('/unread-count', protect, async (req, res) => {
  try {
    const count = await Contact.countDocuments({
      $or: [
        { userId: req.user._id },
        { email: req.user.email }
      ],
      replyMessage: { $ne: '' },
      userHasReadReply: false
    });
    res.json({ success: true, count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST - Mark specific message as read
router.post('/mark-read/:id', protect, async (req, res) => {
  try {
    await Contact.updateOne(
      { _id: req.params.id },
      { $set: { userHasReadReply: true } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Mark all messages as read
router.post('/mark-all-read', protect, async (req, res) => {
  try {
    await Contact.updateMany(
      {
        $or: [
          { userId: req.user._id },
          { email: req.user.email }
        ],
        replyMessage: { $ne: '' },
        userHasReadReply: false
      },
      { $set: { userHasReadReply: true } }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET - All contacts (admin only)
router.get('/', protect, admin, async (req, res) => {
  const contacts = await Contact.find({}).sort({ createdAt: -1 });
  res.json({ success: true, contacts });
});

// PUT - Update contact (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { status, replyMessage } = req.body;
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    
    contact.status = status;
    if (replyMessage) {
      contact.replyMessage = replyMessage;
      contact.replySentAt = new Date();
      // Reset user's read status when admin sends new reply
      contact.userHasReadReply = false;
    }
    await contact.save();
    console.log(`✅ Reply saved for contact ${contact._id}`);
    res.json({ success: true, message: 'Reply saved!' });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Delete contact (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Contact deleted' });
});

module.exports = router;
