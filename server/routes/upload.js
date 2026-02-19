
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const streamifier = require('streamifier');
const auth = require('../middleware/auth');
const { cloudinary } = require('../config/cloudinary');

// Use memory storage — multer v2 works best with buffers; we stream to Cloudinary manually
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/;
        if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Helper: pipe buffer → Cloudinary upload_stream → resolve with secure_url
function uploadToCloudinary(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'socialmart' },
            (err, result) => {
                if (err) return reject(err);
                resolve(result.secure_url);
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
}

// POST /api/upload — returns { url: '<permanent Cloudinary HTTPS URL>' }
router.post('/', auth, upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ msg: 'No image uploaded' });
    try {
        const url = await uploadToCloudinary(req.file.buffer);
        res.json({ url });
    } catch (err) {
        console.error('[Upload] Cloudinary error:', err.message);
        res.status(500).json({ msg: 'Failed to upload image to Cloudinary' });
    }
});

module.exports = router;
