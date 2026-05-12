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
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update return status (Admin only)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status, refundAmount, damageAmount, inspectionNotes, pickupDate, pickupSlot } = req.body;
    
    const returnReq = await Return.findById(req.params.id);
    if (!returnReq) {
      return res.status(404).json({ success: false, message: 'Return request not found' });
    }
    
    returnReq.status = status || returnReq.status;
    if (refundAmount !== undefined) returnReq.refundAmount = refundAmount;
    if (damageAmount !== undefined) returnReq.damageAmount = damageAmount;
    if (inspectionNotes) returnReq.inspectionNotes = inspectionNotes;
    if (pickupDate) returnReq.pickupDate = new Date(pickupDate);
    if (pickupSlot) returnReq.pickupSlot = pickupSlot;
    
    // If approved, update rental status
    if (status === 'approved') {
      await Rental.findByIdAndUpdate(returnReq.rental, { status: 'return_requested' });
    }
    
    // If completed, update rental to completed and process refund
    if (status === 'completed') {
      await Rental.findByIdAndUpdate(returnReq.rental, { status: 'returned' });
    }
    
    await returnReq.save();
    
    res.json({ success: true, message: `Return request ${status}`, return: returnReq });
  } catch (error) {
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
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
