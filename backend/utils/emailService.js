const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"RentEase" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #3B82F6;">Welcome to RentEase!</h1>
      <p>Dear ${user.name},</p>
      <p>Thank you for joining RentEase! We're excited to have you on board.</p>
      <p>With RentEase, you can now:</p>
      <ul>
        <li>Rent furniture and appliances at affordable monthly rates</li>
        <li>Choose flexible rental tenures</li>
        <li>Get free delivery and pickup</li>
        <li>Request maintenance support anytime</li>
      </ul>
      <a href="${process.env.FRONTEND_URL}/products" style="background-color: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Renting Now</a>
      <p>Best regards,<br>RentEase Team</p>
    </div>
  `;
  return await sendEmail(user.email, 'Welcome to RentEase!', html);
};

const sendRentalConfirmation = async (user, rental) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #3B82F6;">Rental Confirmation!</h1>
      <p>Dear ${user.name},</p>
      <p>Your rental has been confirmed successfully!</p>
      <h3>Rental Details:</h3>
      <ul>
        <li>Product: ${rental.product.name}</li>
        <li>Tenure: ${rental.tenureMonths} months</li>
        <li>Monthly Rent: ₹${rental.monthlyRent}</li>
        <li>Total Amount: ₹${rental.totalAmount}</li>
        <li>Start Date: ${new Date(rental.rentalStartDate).toLocaleDateString()}</li>
        <li>End Date: ${new Date(rental.rentalEndDate).toLocaleDateString()}</li>
      </ul>
      <a href="${process.env.FRONTEND_URL}/my-rentals" style="background-color: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View My Rentals</a>
      <p>Best regards,<br>RentEase Team</p>
    </div>
  `;
  return await sendEmail(user.email, 'Rental Confirmation - RentEase', html);
};

module.exports = { sendEmail, sendWelcomeEmail, sendRentalConfirmation };