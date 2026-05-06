const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    if (req.query.type === 'about') uploadPath += 'about/';
    else if (req.query.type === 'team') uploadPath += 'team/';
    else if (req.query.type === 'products') uploadPath += 'products/';
    else uploadPath += 'general/';
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

// Upload single image
router.post('/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
      success: true,
      filename: req.file.filename,
      path: `/uploads/${req.query.type || 'general'}/${req.file.filename}`,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload multiple images
router.post('/images', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    const files = req.files.map(file => ({
      filename: file.filename,
      path: `/uploads/${req.query.type || 'general'}/${file.filename}`
    }));
    res.json({
      success: true,
      files: files,
      message: `${files.length} images uploaded successfully`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all images from a directory
router.get('/images/:type', (req, res) => {
  const type = req.params.type;
  const uploadPath = `uploads/${type}/`;
  
  fs.readdir(uploadPath, (err, files) => {
    if (err) {
      return res.json({ success: true, images: [] });
    }
    const images = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
    res.json({
      success: true,
      images: images.map(img => ({ filename: img, path: `/uploads/${type}/${img}` }))
    });
  });
});

// Delete image
router.delete('/image', (req, res) => {
  const { path: imagePath } = req.query;
  const fullPath = imagePath.replace('/uploads/', 'uploads/');
  
  fs.unlink(fullPath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete image' });
    }
    res.json({ success: true, message: 'Image deleted successfully' });
  });
});

module.exports = router;
