const Razorpay = require('razorpay');
const crypto = require('crypto');
const Rental = require('../models/Rental.model');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay Order - SINGLE
const createPaymentIntent = async (req, res) => {
  try {
    const { rentalId } = req.body;
    const rental = await Rental.findById(rentalId);
    
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    
    if (rental.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const amount = (rental.totalAmount + rental.securityDeposit) * 100;
    
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `receipt_${rentalId}`,
      payment_capture: 1,
      notes: {
        rentalId: rentalId.toString(),
        userId: req.user._id.toString()
      }
    };
    
    const order = await razorpay.orders.create(options);
    
    rental.razorpayOrderId = order.id;
    await rental.save();
    
    res.json({ 
      success: true, 
      key_id: process.env.RAZORPAY_KEY_ID,
      order: order,
      rentalId: rental._id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Verify Payment - SINGLE
const confirmPayment = async (req, res) => {
  try {
    const { 
      rentalId, 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      paymentMethod 
    } = req.body;
    
    console.log('=== VERIFYING SINGLE PAYMENT ===');
    console.log('Rental ID:', rentalId);
    console.log('Payment ID:', razorpay_payment_id);
    
    const rental = await Rental.findById(rentalId);
    
    if (!rental) {
      return res.status(404).json({ success: false, message: 'Rental not found' });
    }
    
    if (rental.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
    
    // UPDATE PAYMENT STATUS
    rental.paymentStatus = 'paid';
    rental.paymentId = razorpay_payment_id;
    rental.paymentMethod = paymentMethod || 'razorpay';
    rental.paymentDate = new Date();
    rental.status = 'active';
    rental.razorpayOrderId = razorpay_order_id;
    rental.razorpaySignature = razorpay_signature;
    
    await rental.save();
    
    console.log(`✅ Payment confirmed for rental ${rentalId}: ₹${rental.totalAmount}`);
    console.log(`✅ Payment Status: ${rental.paymentStatus}`);
    
    res.json({ 
      success: true, 
      message: 'Payment confirmed successfully',
      rental: {
        _id: rental._id,
        paymentStatus: rental.paymentStatus,
        status: rental.status,
        totalAmount: rental.totalAmount
      }
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const rentals = await Rental.find({ 
      user: req.user._id,
      paymentStatus: 'paid'
    }).select('paymentId paymentMethod totalAmount createdAt status').sort({ createdAt: -1 });
    
    res.json({ success: true, payments: rentals });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Admin: Manually update payment status for COD orders
const updatePaymentStatus = async (req, res) => {
  try {
    const { rentalId, paymentStatus } = req.body;
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const rental = await Rental.findById(rentalId);
    
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    
    if (paymentStatus === 'completed' && rental.paymentMethod === 'cod') {
      rental.paymentStatus = 'paid';
      rental.paymentDate = new Date();
      await rental.save();
      
      console.log(`✅ COD payment marked as paid for rental ${rentalId}: ₹${rental.totalAmount}`);
      
      res.json({ 
        success: true, 
        message: 'COD payment marked as paid',
        rental: {
          _id: rental._id,
          paymentStatus: rental.paymentStatus,
          totalAmount: rental.totalAmount
        }
      });
    } 
    else if (paymentStatus === 'paid') {
      rental.paymentStatus = 'paid';
      rental.paymentDate = new Date();
      await rental.save();
      
      res.json({ 
        success: true, 
        message: 'Payment marked as paid',
        rental: {
          _id: rental._id,
          paymentStatus: rental.paymentStatus,
          totalAmount: rental.totalAmount
        }
      });
    }
    else {
      res.status(400).json({ 
        success: false, 
        message: `Invalid payment status transition` 
      });
    }
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Webhook for Razorpay
const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');
    
    if (digest !== signature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }
    
    const { event, payload } = req.body;
    
    if (event === 'payment.captured') {
      const paymentId = payload.payment.entity.id;
      const orderId = payload.payment.entity.order_id;
      
      const rental = await Rental.findOneAndUpdate(
        { razorpayOrderId: orderId },
        { 
          paymentStatus: 'paid',
          paymentId: paymentId,
          paymentDate: new Date(),
          status: 'active'
        },
        { new: true }
      );
      
      console.log(`✅ Webhook: Payment captured for order ${orderId}`);
      console.log(`✅ Updated rental ${rental?._id} payment status to: ${rental?.paymentStatus}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ========== GROUP PAYMENT FOR MULTIPLE RENTALS ==========

// Create group order
const createGroupOrder = async (req, res) => {
  try {
    const { rentalIds, totalAmount } = req.body;
    
    console.log('=== CREATING GROUP ORDER ===');
    console.log('Rental IDs:', rentalIds);
    console.log('Total Amount:', totalAmount);
    
    const amount = totalAmount * 100;
    
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `receipt_group_${Date.now()}`,
      payment_capture: 1,
      notes: {
        rentalIds: JSON.stringify(rentalIds),
        totalAmount: totalAmount,
        isGroupPayment: 'true'
      }
    };
    
    const order = await razorpay.orders.create(options);
    
    for (const rentalId of rentalIds) {
      await Rental.findByIdAndUpdate(rentalId, { 
        razorpayOrderId: order.id,
        groupPayment: true
      });
      console.log(`✅ Updated rental ${rentalId} with order ID: ${order.id}`);
    }
    
    res.json({ 
      success: true, 
      order: order,
      rentalIds: rentalIds
    });
  } catch (error) {
    console.error('Create group order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify group payment - FIXED
const verifyGroupPayment = async (req, res) => {
  try {
    const { rentalIds, razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentMethod } = req.body;
    
    console.log('=== VERIFYING GROUP PAYMENT ===');
    console.log('Rental IDs:', rentalIds);
    console.log('Order ID:', razorpay_order_id);
    console.log('Payment ID:', razorpay_payment_id);
    
    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    if (expectedSignature !== razorpay_signature) {
      console.error('Signature mismatch!');
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
    
    // Update ALL rentals with payment status
    let updatedCount = 0;
    const updatedRentals = [];
    
    for (const rentalId of rentalIds) {
      const rental = await Rental.findById(rentalId);
      if (rental) {
        rental.paymentStatus = 'paid';
        rental.paymentId = razorpay_payment_id;
        rental.paymentMethod = paymentMethod || 'razorpay';
        rental.paymentDate = new Date();
        rental.status = 'active';
        rental.razorpayOrderId = razorpay_order_id;
        rental.razorpaySignature = razorpay_signature;
        await rental.save();
        updatedCount++;
        updatedRentals.push(rentalId);
        console.log(`✅ Updated rental ${rentalId} - Payment Status: ${rental.paymentStatus}`);
      }
    }
    
    console.log(`✅ Group payment verified: ${updatedCount} rentals updated`);
    console.log(`✅ Payment ID: ${razorpay_payment_id}`);
    
    res.json({ 
      success: true, 
      message: `Payment verified for ${updatedCount} rentals`,
      updatedCount: updatedCount,
      rentalIds: updatedRentals
    });
  } catch (error) {
    console.error('Verify group payment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  createPaymentIntent, 
  confirmPayment, 
  getPaymentHistory,
  updatePaymentStatus,
  razorpayWebhook,
  createGroupOrder,
  verifyGroupPayment
};
