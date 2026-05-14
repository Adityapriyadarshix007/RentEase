const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect, admin } = require('../middleware/auth.middleware');

// Configure multer for memory storage (Cloudinary will handle the actual storage)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

// Upload single image to Cloudinary
router.post('/single', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'rentease/products',
          transformation: [
            { width: 800, height: 800, crop: 'limit', quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload multiple images to Cloudinary
router.post('/multiple', protect, admin, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'rentease/products',
            transformation: [
              { width: 800, height: 800, crop: 'limit', quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);
    const urls = results.map(r => r.secure_url);
    const publicIds = results.map(r => r.public_id);

    res.json({
      success: true,
      urls: urls,
      publicIds: publicIds
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete image from Cloudinary
router.delete('/:publicId', protect, admin, async (req, res) => {
  try {
    const { publicId } = req.params;
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
