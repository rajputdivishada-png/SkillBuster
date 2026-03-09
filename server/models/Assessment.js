const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skillName: {
        type: String,
        required: [true, 'Skill name is required'],
        trim: true
    },
    industry: {
        type: String,
        required: [true, 'Industry is required'],
        trim: true
    },
    overallScore: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    passed: {
        type: Boolean,
        default: false
    },
    skillLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'Beginner'
    },
    dimensions: {
        technicalAccuracy: {
            score: { type: Number, min: 0, max: 100 },
            observation: String
        },
        efficiency: {
            score: { type: Number, min: 0, max: 100 },
            observation: String
        },
        bestPractices: {
            score: { type: Number, min: 0, max: 100 },
            observation: String
        },
        problemSolving: {
            score: { type: Number, min: 0, max: 100 },
            observation: String
        }
    },
    strengths: [String],
    improvements: [String],
    employerSummary: {
        type: String,
        default: ''
    },
    verifiedSkills: [String],
    videoPath: {
        type: String,
        default: ''
    },
    badgeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for employer searches
assessmentSchema.index({ skillName: 1, overallScore: -1 });
assessmentSchema.index({ candidateId: 1 });

module.exports = mongoose.model('Assessment', assessmentSchema);
