const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const badgeSchema = new mongoose.Schema({
    badgeId: {
        type: String,
        default: () => uuidv4(),
        unique: true,
        index: true
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assessmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assessment',
        required: true
    },
    candidateName: {
        type: String,
        required: true
    },
    skillName: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    overallScore: {
        type: Number,
        required: true
    },
    skillLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        required: true
    },
    verifiedSkills: [String],
    employerSummary: {
        type: String,
        default: ''
    },
    issuedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Badge', badgeSchema);
