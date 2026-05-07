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

console.log('=== EMAIL CONFIGURATION CHECK ===');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Not set');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Not set');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST || 'smtp.gmail.com');
console.log('EMAIL_PORT:', process.env.EMAIL_PORT || 587);
console.log('================================');

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
  
  // Verify transporter configuration
  transporter.verify(function(error, success) {
    if (error) {
      console.error('❌ Email transporter verification failed:', error.message);
    } else {
      console.log('✅ Email transporter verified and ready!');
    }
  });
  console.log('✅ Email transporter configured');
} else {
  console.log('⚠️ Email credentials missing. Emails will not be sent.');
}

// Function to send email
async function sendReplyEmail(contact, replyMessage) {
  if (!transporter) {
    console.log('❌ Email disabled - no transporter');
    return false;
  }
  
  try {
    console.log(`📧 Attempting to send email to: ${contact.email}`);
    console.log(`📧 Reply message length: ${replyMessage.length} characters`);
    
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
            <p>Thank you for contacting RentEase. Here's our response to your query:</p>
            
            <div style="background: #f3f4f6; padding: 15px; border-left: 4px solid #3B82F6; margin: 20px 0;">
              <p style="margin: 0; color: #6b7280;"><strong>Your Message:</strong></p>
              <p style="margin: 10px 0 0 0;">${contact.message}</p>
            </div>
            
            <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #3B82F6;"><strong>Our Response:</strong></p>
              <p style="margin: 10px 0 0 0;">${replyMessage}</p>
            </div>
            
            <p>If you have any further questions, please don't hesitate to contact us again.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
            <p style="font-size: 12px; color: #6b7280; text-align: center;">
              &copy; 2024 RentEase. All rights reserved.<br>
              <a href="https://rentease-frontend-ul7h.onrender.com" style="color: #3B82F6;">Visit our website</a>
            </p>
          </div>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Recipient:', contact.email);
    return true;
  } catch (error) {
    console.error('❌ Email failed:');
    console.error('   Error message:', error.message);
    console.error('   Error code:', error.code);
    if (error.response) console.error('   Response:', error.response);
    return false;
  }
}

const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    const contact = new Contact({ name, email, subject, message, status: 'unread' });
    await contact.save();
    
    console.log('📧 New contact from:', email);
    res.status(201).json({ success: true, message: 'Message sent successfully!' });
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
    console.log(`📋 Retrieved ${contacts.length} contacts`);
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
    
    console.log(`📝 Updating contact ${contact._id} to status: ${status}`);
    
    contact.status = status;
    let emailSent = false;
    
    if (replyMessage) {
      contact.replyMessage = replyMessage;
      contact.replySentAt = new Date();
      
      console.log(`📧 Sending reply to ${contact.email}...`);
      emailSent = await sendReplyEmail(contact, replyMessage);
      
      if (emailSent) {
        console.log(`✅ Reply email sent to ${contact.email}`);
      } else {
        console.log(`⚠️ Failed to send email to ${contact.email}`);
      }
    }
    
    await contact.save();
    
    const responseMessage = emailSent 
      ? 'Reply saved and email sent!' 
      : 'Reply saved but email failed. Check email configuration.';
    
    console.log(`✅ Contact updated. Email sent: ${emailSent}`);
    
    res.json({ 
      success: true, 
      message: responseMessage,
      emailSent: emailSent 
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
    console.log(`🗑️ Deleted contact ${contact._id}`);
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
