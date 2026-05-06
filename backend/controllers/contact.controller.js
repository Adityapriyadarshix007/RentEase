const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// Email transporter configuration
let transporter;
try {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  console.log('Email transporter configured');
} catch (error) {
  console.error('Email transporter error:', error.message);
}

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

// Function to send email reply
const sendReplyEmail = async (contact, replyMessage) => {
  try {
    console.log('Attempting to send email to:', contact.email);
    console.log('Using email account:', process.env.EMAIL_USER);
    
    if (!transporter) {
      console.error('Email transporter not configured');
      return false;
    }
    
    const mailOptions = {
      from: `"RentEase Support" <${process.env.EMAIL_USER || 'support@rentease.com'}>`,
      to: contact.email,
      subject: `Re: ${contact.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background-color: #3B82F6; padding: 15px; text-align: center; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">RentEase Support</h2>
          </div>
          <div style="padding: 20px;">
            <p style="font-size: 16px; color: #333;">Dear <strong>${contact.name}</strong>,</p>
            <p style="font-size: 16px; color: #333;">Thank you for reaching out to us. Regarding your query:</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #3B82F6; margin: 15px 0;">
              <p style="margin: 0; color: #666;"><strong>Your Message:</strong></p>
              <p style="margin: 5px 0 0 0; color: #333;">${contact.message}</p>
            </div>
            <p style="font-size: 16px; color: #333;"><strong>Our Response:</strong></p>
            <div style="background-color: #e8f4fd; padding: 15px; border-radius: 8px; margin: 10px 0;">
              <p style="margin: 0; color: #333; line-height: 1.6;">${replyMessage}</p>
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 20px;">If you have any further questions, feel free to reply to this email.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
            <p style="font-size: 12px; color: #999; text-align: center;">This is a response from RentEase Support Team.</p>
          </div>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending reply email:', error.message);
    console.error('Full error:', error);
    return false;
  }
};

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

const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ success: true, contact });
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
      
      // Try to send email
      emailSent = await sendReplyEmail(contact, replyMessage);
      console.log(`Email sent status: ${emailSent}`);
    }
    
    await contact.save();
    res.json({ 
      success: true, 
      message: emailSent ? 'Reply sent via email!' : 'Reply saved (email notification failed - check email settings)',
      emailSent 
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
  getContactById,
  updateContactStatus,
  deleteContact
};
