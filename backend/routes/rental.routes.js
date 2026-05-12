const express = require('express');
const router = express.Router();
const { 
  createRental, 
  getUserRentals, 
  getRentalById, 
  cancelRental, 
  getAllRentals,
  updateRentalStatus,
  validatePincode
} = require('../controllers/rental.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// User routes
router.post('/', createRental);
router.post('/validate-pincode', validatePincode);
router.get('/my-rentals', getUserRentals);
router.get('/:id', getRentalById);
router.put('/:id/cancel', cancelRental);

// Admin only routes
router.get('/', admin, getAllRentals);
router.put('/:id/status', admin, updateRentalStatus);

module.exports = router;
