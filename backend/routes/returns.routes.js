const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Return = require('../models/Return.model');

router.post('/', protect, async (req, res) => {
  try {
    const { rentalId, reason, description } = req.body;
    const rental = await require('../models/Rental.model').findById(rentalId);
    
    const returnReq = new Return({
      rental: rentalId,
      user: req.user._id,
      product: rental.product,
      reason,
      description
    });
    await returnReq.save();
    res.json({ success: true, return: returnReq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/my-returns', protect, async (req, res) => {
  try {
    const returns = await Return.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, returns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
