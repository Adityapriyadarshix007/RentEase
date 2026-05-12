const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.middleware');
const Return = require('../models/Return.model');
const Rental = require('../models/Rental.model');

// Get all returns (Admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.status = status;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const returns = await Return.find(query)
      .populate('user', 'name email phone')
      .populate('product', 'name monthlyRent images category')
      .populate('rental', 'totalAmount rentalStartDate rentalEndDate')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Return.countDocuments(query);
    
    res.json({
      success: true,
      returns,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching returns:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get return by ID (Admin only)
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const returnReq = await Return.findById(req.params.id)
      .populate('user', 'name email phone address')
      .populate('product', 'name monthlyRent images category description')
      .populate('rental', 'totalAmount rentalStartDate rentalEndDate paymentStatus');
    
    if (!returnReq) {
      return res.status(404).json({ success: false, message: 'Return request not found' });
    }
    
    res.json({ success: true, return: returnReq });
  } catch (error) {
    console.error('Error fetching return by ID:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update return status (Admin only) - FIXED with non-negative refund
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status, refundAmount, damageAmount, inspectionNotes, pickupDate, pickupSlot } = req.body;
    
    const returnReq = await Return.findById(req.params.id);
    if (!returnReq) {
      return res.status(404).json({ success: false, message: 'Return request not found' });
    }
    
    // Get the original rental amount
    const rental = await Rental.findById(returnReq.rental);
    
    // Calculate refund amount - ensure it's never negative
    let finalRefundAmount = returnReq.refundAmount;
    let finalDamageAmount = Math.max(0, parseFloat(damageAmount) || 0);
    
    if (status === 'completed') {
      const originalAmount = rental?.totalAmount || 0;
      finalRefundAmount = Math.max(0, originalAmount - finalDamageAmount);
      returnReq.refundAmount = finalRefundAmount;
      returnReq.damageAmount = finalDamageAmount;
    }
    
    if (refundAmount !== undefined && parseFloat(refundAmount) >= 0) {
      finalRefundAmount = Math.max(0, parseFloat(refundAmount));
      returnReq.refundAmount = finalRefundAmount;
    }
    
    returnReq.status = status || returnReq.status;
    if (inspectionNotes) returnReq.inspectionNotes = inspectionNotes;
    if (pickupDate) returnReq.pickupDate = new Date(pickupDate);
    if (pickupSlot) returnReq.pickupSlot = pickupSlot;
    
    // If approved, update rental status
    if (status === 'approved') {
      await Rental.findByIdAndUpdate(returnReq.rental, { status: 'return_requested' });
    }
    
    // If completed, update rental status
    if (status === 'completed') {
      await Rental.findByIdAndUpdate(returnReq.rental, { status: 'returned' });
    }
    
    await returnReq.save();
    
    res.json({ 
      success: true, 
      message: `Return request ${status}`,
      return: returnReq,
      refundAmount: finalRefundAmount
    });
  } catch (error) {
    console.error('Update return status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get returns analytics (Admin only)
router.get('/analytics/summary', protect, admin, async (req, res) => {
  try {
    const totalReturns = await Return.countDocuments();
    const pendingReturns = await Return.countDocuments({ status: 'pending' });
    const approvedReturns = await Return.countDocuments({ status: 'approved' });
    const completedReturns = await Return.countDocuments({ status: 'completed' });
    const rejectedReturns = await Return.countDocuments({ status: 'rejected' });
    
    const totalRefundAmount = await Return.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$refundAmount' } } }
    ]);
    
    const returnsByReason = await Return.aggregate([
      { $group: { _id: '$reason', count: { $sum: 1 } } }
    ]);
    
    const monthlyReturns = await Return.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
          totalRefund: { $sum: '$refundAmount' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    
    res.json({
      success: true,
      analytics: {
        totalReturns,
        pendingReturns,
        approvedReturns,
        completedReturns,
        rejectedReturns,
        totalRefundAmount: totalRefundAmount[0]?.total || 0,
        returnsByReason,
        monthlyReturns
      }
    });
  } catch (error) {
    console.error('Returns analytics error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
