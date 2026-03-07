const express = require('express');
const { verifyBadge } = require('../controllers/badgeController');

const router = express.Router();

// GET /api/verify/:badgeId — Public badge verification (no auth required)
router.get('/:badgeId', verifyBadge);

module.exports = router;
