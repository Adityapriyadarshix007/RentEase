const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.middleware');
const Category = require('../models/Category.Model');

// GET all categories - PUBLIC
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create category - ADMIN ONLY
router.post('/', protect, admin, async (req, res) => {
  try {
    console.log('📝 Creating category with data:', req.body);
    
    const { name, slug, description, image, order } = req.body;
    
    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Name and slug are required' });
    }
    
    const existing = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category with this name or slug already exists' });
    }
    
    const category = new Category({
      name,
      slug,
      description: description || '',
      image: image || '',
      order: order || 0,
      isActive: true
    });
    
    await category.save();
    console.log(`✅ Category created: ${name}`);
    res.status(201).json({ success: true, category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update category - ADMIN ONLY
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, slug, description, image, order, isActive } = req.body;
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    category.name = name || category.name;
    category.slug = slug || category.slug;
    category.description = description !== undefined ? description : category.description;
    category.image = image !== undefined ? image : category.image;
    category.order = order !== undefined ? order : category.order;
    category.isActive = isActive !== undefined ? isActive : category.isActive;
    
    await category.save();
    res.json({ success: true, category });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE category - ADMIN ONLY
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
