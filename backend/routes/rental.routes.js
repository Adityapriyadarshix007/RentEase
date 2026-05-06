const express = require('express');
const router = express.Router();
const { 
  createRental, 
  getUserRentals, 
  getRentalById, 
  cancelRental, 
  getAllRentals,
  updateRentalStatus 
} = require('../controllers/rental.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', createRental);
router.get('/my-rentals', getUserRentals);
router.get('/', admin, getAllRentals);
router.get('/:id', getRentalById);
router.put('/:id/cancel', cancelRental);
router.put('/:id/status', admin, updateRentalStatus);

module.exports = router;
