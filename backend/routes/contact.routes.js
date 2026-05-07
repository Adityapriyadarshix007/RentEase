const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { protect, admin } = require('../middleware/auth.middleware');

console.log('🔧 Contact routes loaded with email support');

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: String, email: String, subject: String, message: String,
  status: { type: String, default: 'unread' },
  replyMessage: String, replySentAt: Date, createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Email transporter
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: { rejectUnauthorized: false }
  });
  console.log('✅ Email transporter ready');
}

// Function to send email
async function sendEmail(contact, replyMessage) {
  if (!transporter) {
    console.log('❌ No email transporter');
    return false;
  }
  
  try {
    console.log(`📧 Sending email to ${contact.email}...`);
    await transporter.sendMail({
      from: `"RentEase Support" <${process.env.EMAIL_USER}>`,
      to: contact.email,
      subject: `Re: ${contact.subject} - RentEase Support`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px;">
          <div style="background: #3B82F6; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">RentEase Support</h1>
          </div>
          <div style="padding: 20px;">
            <p>Dear <strong>${contact.name}</strong>,</p>
            <p>Thank you for contacting us. Here's our response:</p>
            <div style="background: #f3f4f6; padding: 15px; border-left: 4px solid #3B82F6; margin: 20px 0;">
              <p><strong>Your Message:</strong></p>
              <p>${contact.message}</p>
            </div>
            <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Our Response:</strong></p>
              <p>${replyMessage}</p>
            </div>
            <p>Best regards,<br>RentEase Team</p>
          </div>
        </div>
      `
    });
    console.log(`✅ Email sent to ${contact.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Email failed: ${error.message}`);
    return false;
  }
}

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
    
    contact.status = status;
    let emailSent = false;
    
    if (replyMessage) {
      contact.replyMessage = replyMessage;
      contact.replySentAt = new Date();
      console.log(`📧 Attempting to send email to ${contact.email}...`);
      emailSent = await sendEmail(contact, replyMessage);
      console.log(`📧 Email result: ${emailSent ? 'SENT ✅' : 'FAILED ❌'}`);
    }
    
    await contact.save();
    
    res.json({ 
      success: true, 
      message: emailSent ? 'Reply saved and email sent!' : 'Reply saved but email failed',
      emailSent: emailSent 
    });
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
