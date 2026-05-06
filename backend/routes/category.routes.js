const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.middleware');

// Category model
const mongoose = require('mongoose');

let Category;
try {
  Category = require('../models/Category.model');
} catch (error) {
  const categorySchema = new mongoose.Schema({
    name: String,
    slug: String,
    description: String,
    image: String,
    icon: String,
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    isActive: { type: Boolean, default: true },
    order: Number,
    createdAt: { type: Date, default: Date.now }
  });
  Category = mongoose.model('Category', categorySchema);
}

// GET categories - Public (no auth required)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST category - Admin only
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, slug, description, image, icon, parentCategory, order } = req.body;
    const category = new Category({ name, slug, description, image, icon, parentCategory, order, isActive: true });
    await category.save();
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT category - Admin only
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    Object.assign(category, req.body);
    await category.save();
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE category - Admin only
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
