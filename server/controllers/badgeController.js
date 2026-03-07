const { store, generateId } = require('../store');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate a badge for a passed assessment
 */
const generateBadge = (assessmentId, user) => {
    const assessment = store.findById('assessments', assessmentId);
    if (!assessment) {
        throw new Error('Assessment not found');
    }

    if (!assessment.passed) {
        throw new Error('Cannot generate badge for a failed assessment');
    }

    // Check if badge already exists for this assessment
    const existingBadge = store.findOne('badges', (b) => b.assessmentId === assessmentId);
    if (existingBadge) {
        return existingBadge;
    }

    const candidate = user || store.findById('users', assessment.candidateId);

    const badge = store.insert('badges', {
        badgeId: uuidv4(),
        candidateId: assessment.candidateId,
        assessmentId: assessment._id,
        candidateName: candidate.name,
        skillName: assessment.skillName,
        industry: assessment.industry,
        overallScore: assessment.overallScore,
        skillLevel: assessment.skillLevel,
        verifiedSkills: assessment.verifiedSkills,
        employerSummary: assessment.employerSummary,
        issuedAt: new Date().toISOString()
    });

    return badge;
};

/**
 * POST /api/badge/:assessmentId
 */
const createBadge = (req, res) => {
    try {
        const { assessmentId } = req.params;
        const badge = generateBadge(assessmentId, req.user);

        // Update assessment with badge reference
        store.updateById('assessments', assessmentId, { badgeId: badge._id });

        res.status(201).json({ message: 'Badge generated', badge });
    } catch (error) {
        console.error('Badge generation error:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * GET /api/verify/:badgeId — Public endpoint
 */
const verifyBadge = (req, res) => {
    try {
        const { badgeId } = req.params;
        const badge = store.findOne('badges', (b) => b.badgeId === badgeId);

        if (!badge) {
            return res.status(404).json({ message: 'Badge not found', valid: false });
        }

        // Get the full assessment for detailed report
        const assessment = store.findById('assessments', badge.assessmentId);

        res.json({
            valid: true,
            badge,
            assessment: assessment ? {
                dimensions: assessment.dimensions,
                strengths: assessment.strengths,
                improvements: assessment.improvements,
                employerSummary: assessment.employerSummary,
                createdAt: assessment.createdAt
            } : null
        });
    } catch (error) {
        console.error('Badge verification error:', error);
        res.status(500).json({ message: 'Verification failed', error: error.message });
    }
};

/**
 * GET /api/badges/my — Get all badges for logged-in candidate
 */
const getMyBadges = (req, res) => {
    try {
        const badges = store.find('badges', (b) => b.candidateId === req.user._id)
            .sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt));
        res.json(badges);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch badges', error: error.message });
    }
};

module.exports = { generateBadge, createBadge, verifyBadge, getMyBadges };
