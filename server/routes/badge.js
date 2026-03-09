const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { createBadge, getMyBadges } = require('../controllers/badgeController');

const router = express.Router();

// POST /api/badge/:assessmentId — Generate badge for a passed assessment
router.post('/:assessmentId', protect, authorize('candidate'), createBadge);

// GET /api/badges/my — Get all badges for logged-in candidate
router.get('/my', protect, getMyBadges);

module.exports = router;
