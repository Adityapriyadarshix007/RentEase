const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }
  next();
};

const validateRental = [
  body('productId').isMongoId().withMessage('Invalid product ID'),
  body('tenureMonths').isInt({ min: 1, max: 12 }).withMessage('Tenure must be between 1 and 12 months'),
  body('deliveryAddress.street').notEmpty().withMessage('Street address is required'),
  body('deliveryAddress.city').notEmpty().withMessage('City is required'),
  body('deliveryAddress.state').notEmpty().withMessage('State is required'),
  body('deliveryAddress.pincode').isLength({ min: 6, max: 6 }).withMessage('Pincode must be 6 digits'),
  body('deliveryDate').isISO8601().withMessage('Valid delivery date is required'),
  validate
];

module.exports = { validate, validateRental };
