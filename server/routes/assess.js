const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect, authorize } = require('../middleware/auth');
const { assessSkill } = require('../controllers/geminiController');
const { store } = require('../store');

const router = express.Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname) || '.webm';
        cb(null, `video-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['video/webm', 'video/mp4', 'video/avi', 'video/quicktime', 'video/x-matroska'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed'), false);
        }
    }
});

// POST /api/assess — Upload video and get AI assessment
router.post('/', protect, authorize('candidate'), upload.single('video'), assessSkill);

// GET /api/assess/:id — Get assessment by ID
router.get('/:id', protect, (req, res) => {
    try {
        const assessment = store.findById('assessments', req.params.id);
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        res.json(assessment);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch assessment', error: error.message });
    }
});

module.exports = router;
