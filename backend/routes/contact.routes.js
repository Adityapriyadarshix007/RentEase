const express = require('express');
const router = express.Router();
const {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact
} = require('../controllers/contact.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// Public route - anyone can submit contact form
router.post('/', submitContact);

// Admin only routes
router.get('/', protect, admin, getAllContacts);
router.get('/:id', protect, admin, getContactById);
router.put('/:id', protect, admin, updateContactStatus);
router.delete('/:id', protect, admin, deleteContact);

module.exports = router;
