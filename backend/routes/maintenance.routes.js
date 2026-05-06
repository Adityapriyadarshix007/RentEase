const express = require('express');
const router = express.Router();
const { 
  createRequest, 
  getUserRequests, 
  getRequestById,
  getAllRequests, 
  updateRequestStatus,
  deleteRequest
} = require('../controllers/maintenance.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.post('/', protect, createRequest);
router.get('/my-requests', protect, getUserRequests);
router.get('/:id', protect, getRequestById);
router.get('/', protect, admin, getAllRequests);
router.put('/:id/status', protect, admin, updateRequestStatus);
router.delete('/:id', protect, admin, deleteRequest);

module.exports = router;