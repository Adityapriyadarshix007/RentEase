const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect, admin } = require('../middleware/auth.middleware');

console.log('🔧 Contact routes loaded with Brevo API');

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: String, email: String, subject: String, message: String,
  status: { type: String, default: 'unread' },
  replyMessage: String, replySentAt: Date, createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Send email using Brevo REST API
async function sendEmailViaBrevo(contact, replyMessage) {
  const BREVO_API_KEY = process.env.EMAIL_PASS;
  
  if (!BREVO_API_KEY) {
    console.log('❌ No Brevo API key');
    return false;
  }
  
  try {
    console.log(`📧 Sending email to ${contact.email} via Brevo API...`);
    
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { name: 'RentEase Support', email: 'apsp15012005@gmail.com' },
        to: [{ email: contact.email, name: contact.name }],
        subject: `Re: ${contact.subject} - RentEase Support`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2 style="color: #3B82F6;">RentEase Support</h2>
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
        `
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Email sent via Brevo API to ${contact.email}`);
      return true;
    } else {
      console.error(`❌ Brevo API error:`, data);
      return false;
    }
  } catch (error) {
    console.error(`❌ Email failed: ${error.message}`);
    return false;
  }
}

// POST - Submit contact form
router.post('/', async (req, res) => {
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
    let emailSent = false;
    
    if (replyMessage) {
      contact.replyMessage = replyMessage;
      contact.replySentAt = new Date();
      emailSent = await sendEmailViaBrevo(contact, replyMessage);
    }
    
    await contact.save();
    res.json({ 
      success: true, 
      message: emailSent ? 'Reply saved and email sent!' : 'Reply saved but email failed',
      emailSent 
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Delete contact (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Contact deleted' });
});

module.exports = router;
