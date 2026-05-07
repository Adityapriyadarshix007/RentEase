const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

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

// Create email transporter
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
  console.log('✅ Email transporter created');
} else {
  console.log('⚠️ Email credentials missing');
}

async function sendReplyEmail(contact, replyMessage) {
  console.log(`📧 sendReplyEmail called for ${contact.email}`);
  console.log(`📧 Transporter exists: ${!!transporter}`);
  
  if (!transporter) {
    console.log('❌ No transporter - returning false');
    return false;
  }
  
  try {
    const mailOptions = {
      from: `"RentEase Support" <${process.env.EMAIL_USER}>`,
      to: contact.email,
      subject: `Re: ${contact.subject} - RentEase Support`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #3B82F6, #1E3A8A); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; color: white;">RentEase Support</h1>
          </div>
          <div style="padding: 20px;">
            <p>Dear <strong>${contact.name}</strong>,</p>
            <p>Thank you for contacting RentEase. Here's our response:</p>
            <div style="background: #f3f4f6; padding: 15px; border-left: 4px solid #3B82F6; margin: 20px 0;">
              <p style="margin: 0;"><strong>Your Message:</strong></p>
              <p style="margin: 10px 0 0 0;">${contact.message}</p>
            </div>
            <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Our Response:</strong></p>
              <p style="margin: 10px 0 0 0;">${replyMessage}</p>
            </div>
            <p>Best regards,<br>RentEase Support Team</p>
          </div>
        </div>
      `
    };
    
    console.log('📧 Attempting to send mail...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent! Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
  }
}

const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = new Contact({ name, email, subject, message, status: 'unread' });
    await contact.save();
    console.log('📧 New contact from:', email);
    res.status(201).json({ success: true, message: 'Message sent!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateContactStatus = async (req, res) => {
  try {
    const { status, replyMessage } = req.body;
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    
    contact.status = status;
    let emailSent = false;
    
    if (replyMessage) {
      contact.replyMessage = replyMessage;
      contact.replySentAt = new Date();
      console.log(`📝 Sending reply to ${contact.email}...`);
      emailSent = await sendReplyEmail(contact, replyMessage);
      console.log(`📝 Email result: ${emailSent}`);
    }
    
    await contact.save();
    res.json({ success: true, message: emailSent ? 'Reply saved and email sent!' : 'Reply saved but email failed.', emailSent });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitContact, getAllContacts, updateContactStatus, deleteContact };
