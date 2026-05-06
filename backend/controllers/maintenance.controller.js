const Maintenance = require('../models/Maintenance.model');
const Rental = require('../models/Rental.model');

const createRequest = async (req, res) => {
  try {
    const { rentalId, issueType, issueTitle, description, preferredDate, preferredSlot, images } = req.body;
    
    const rental = await Rental.findById(rentalId);
    if (!rental || rental.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    
    const maintenance = await Maintenance.create({
      rental: rentalId,
      user: req.user._id,
      product: rental.product,
      issueType,
      issueTitle,
      description,
      preferredDate: new Date(preferredDate),
      preferredSlot,
      images: images || []
    });
    
    res.status(201).json({ success: true, maintenance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = { user: req.user._id };
    
    if (status) query.status = status;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const requests = await Maintenance.find(query)
      .populate('product')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Maintenance.countDocuments(query);
    
    res.json({
      success: true,
      requests,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRequestById = async (req, res) => {
  try {
    const request = await Maintenance.findById(req.params.id)
      .populate('product')
      .populate('user', 'name email phone')
      .populate('rental');
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    if (request.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.status = status;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const requests = await Maintenance.find(query)
      .populate('user', 'name email phone')
      .populate('product')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Maintenance.countDocuments(query);
    
    res.json({
      success: true,
      requests,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { status, resolutionNotes, technicianName, technicianContact, resolutionCost } = req.body;
    const request = await Maintenance.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    request.status = status;
    
    if (status === 'assigned') {
      request.assignedAt = new Date();
      request.assignedTo = req.user._id;
      if (technicianName) request.technicianName = technicianName;
      if (technicianContact) request.technicianContact = technicianContact;
    }
    
    if (resolutionNotes) request.resolutionNotes = resolutionNotes;
    if (resolutionCost) request.resolutionCost = resolutionCost;
    
    if (status === 'resolved') request.resolvedAt = new Date();
    
    await request.save();
    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const request = await Maintenance.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    await request.deleteOne();
    res.json({ success: true, message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createRequest, 
  getUserRequests, 
  getRequestById,
  getAllRequests, 
  updateRequestStatus,
  deleteRequest
};