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

// Create email transporter (will work even without env vars - just logs)
let transporter = null;
try {
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
    console.log('✅ Email transporter configured');
  } else {
    console.log('⚠️ Email credentials not set. Email notifications disabled.');
  }
} catch (error) {
  console.error('Email transporter error:', error.message);
}

// Function to send email reply
const sendReplyEmail = async (contact, replyMessage) => {
  if (!transporter) {
    console.log('Email disabled - no transporter');
    return false;
  }
  
  try {
    const mailOptions = {
      from: `"RentEase Support" <${process.env.EMAIL_USER || 'support@rentease.com'}>`,
      to: contact.email,
      subject: `Re: ${contact.subject} - RentEase Support`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>RentEase Support Reply</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6, #1E3A8A); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
            .message-box { background: white; padding: 15px; border-left: 4px solid #3B82F6; margin: 20px 0; border-radius: 5px; }
            .reply-box { background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; margin-top: 20px; }
            .button { display: inline-block; background: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">RentEase Support</h1>
              <p style="margin: 5px 0 0 0;">Customer Support Team</p>
            </div>
            <div class="content">
              <p>Dear <strong>${contact.name}</strong>,</p>
              <p>Thank you for reaching out to RentEase. We have reviewed your query and here's our response:</p>
              
              <div class="message-box">
                <p style="margin: 0; color: #666;"><strong>Your Query:</strong></p>
                <p style="margin: 10px 0 0 0;">${contact.message}</p>
              </div>
              
              <div class="reply-box">
                <p style="margin: 0; color: #3B82F6;"><strong>📝 Our Response:</strong></p>
                <p style="margin: 10px 0 0 0; line-height: 1.6;">${replyMessage.replace(/\n/g, '<br>')}</p>
              </div>
              
              <p>If you have any further questions, please don't hesitate to reply to this email or visit our <a href="https://rentease-frontend-ul7h.onrender.com/contact" style="color: #3B82F6;">contact page</a>.</p>
              
              <div style="text-align: center;">
                <a href="https://rentease-frontend-ul7h.onrender.com" class="button">Visit RentEase</a>
              </div>
            </div>
            <div class="footer">
              <p>&copy; 2024 RentEase. All rights reserved.</p>
              <p>123 Business Park, Mumbai, India | support@rentease.com</p>
              <p style="font-size: 11px;">This is an automated response from RentEase Support Team.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to:', contact.email, 'Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
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
    
    console.log('📧 New contact message from:', email);
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
      
      // Try to send email notification
      emailSent = await sendReplyEmail(contact, replyMessage);
      if (emailSent) {
        console.log(`✅ Reply email sent to ${contact.email}`);
      } else {
        console.log(`⚠️ Could not send email to ${contact.email}`);
      }
    }
    
    await contact.save();
    
    res.json({ 
      success: true, 
      message: emailSent ? '✅ Reply sent and email notification delivered!' : '⚠️ Reply saved but email notification failed (check email settings)',
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
  updateContactStatus,
  deleteContact
};
