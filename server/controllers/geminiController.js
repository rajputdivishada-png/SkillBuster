const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const fs = require('fs');
const path = require('path');
const { store } = require('../store');
const { getAssessmentPrompt } = require('../prompts/skillRubrics');
const { generateBadge } = require('./badgeController');

// Model priority list — try each in order until one works
const MODEL_PRIORITY = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
];

/**
 * Try to call Gemini with the uploaded file, trying multiple models
 */
async function callGeminiWithVideo(fileUri, fileMimeType, prompt, apiKey) {
    const genAI = new GoogleGenerativeAI(apiKey);
    let lastError = null;

    for (const modelName of MODEL_PRIORITY) {
        try {
            console.log(`🤖 Trying model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const result = await model.generateContent([
                {
                    fileData: {
                        mimeType: fileMimeType,
                        fileUri: fileUri
                    }
                },
                { text: prompt }
            ]);

            const response = await result.response;
            let responseText = response.text();

            console.log(`✅ ${modelName} responded successfully`);

            // Clean potential markdown code fences
            responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            // Try to parse as JSON
            const parsed = JSON.parse(responseText);
            return { data: parsed, model: modelName };

        } catch (err) {
            console.warn(`⚠️ ${modelName} failed: ${err.message.substring(0, 120)}`);
            lastError = err;
            // If quota exceeded or rate limited, try next model
            continue;
        }
    }

    // All models failed
    throw lastError || new Error('All Gemini models failed');
}

/**
 * Assess a candidate's skill via video analysis using Gemini Vision
 * POST /api/assess
 */
const assessSkill = async (req, res) => {
    try {
        const { skillName, industry } = req.body;

        if (!skillName || !industry) {
            return res.status(400).json({ message: 'skillName and industry are required' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Video file is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: 'GEMINI_API_KEY is not configured on the server. Please add it to .env' });
        }

        const videoPath = req.file.path;
        const mimeType = req.file.mimetype || 'video/webm';
        const prompt = getAssessmentPrompt(skillName, industry);

        let assessmentData;
        let usedModel = 'none';
        let isGeminiAnalysis = false;

        try {
            // Use Google AI File Manager for uploading large video files
            const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

            const fileSizeMB = (req.file.size / (1024 * 1024)).toFixed(1);
            console.log(`\n${'='.repeat(60)}`);
            console.log(`📤 Uploading video (${fileSizeMB}MB, ${mimeType}) to Gemini...`);

            const uploadResult = await fileManager.uploadFile(videoPath, {
                mimeType: mimeType,
                displayName: `skill-assessment-${skillName}-${Date.now()}`
            });

            console.log(`✅ Upload complete. URI: ${uploadResult.file.uri}`);

            // Wait for file to be processed
            let file = uploadResult.file;
            let waitCount = 0;
            while (file.state === 'PROCESSING') {
                waitCount++;
                console.log(`⏳ Waiting for video processing... (${waitCount * 3}s)`);
                await new Promise(resolve => setTimeout(resolve, 3000));
                file = await fileManager.getFile(file.name);

                // Timeout after 2 minutes
                if (waitCount > 40) {
                    throw new Error('Video processing timed out after 2 minutes');
                }
            }

            if (file.state === 'FAILED') {
                throw new Error('Video processing failed by Gemini');
            }

            console.log(`✅ Video processed. State: ${file.state}`);
            console.log('🧠 Sending to Gemini for skill assessment...');

            // Call Gemini with model fallback
            const geminiResult = await callGeminiWithVideo(
                file.uri,
                file.mimeType,
                prompt,
                process.env.GEMINI_API_KEY
            );

            assessmentData = geminiResult.data;
            usedModel = geminiResult.model;
            isGeminiAnalysis = true;

            console.log(`📊 Assessment received from ${usedModel}:`);
            console.log(`   Score: ${assessmentData.overallScore}, Level: ${assessmentData.skillLevel}, Passed: ${assessmentData.passed}`);

            // Validate the response structure
            assessmentData = validateAndNormalizeAssessment(assessmentData, skillName);

        } catch (geminiError) {
            console.error(`\n❌ GEMINI API ERROR: ${geminiError.message}`);
            console.error('━'.repeat(60));
            console.error('The video could NOT be analyzed by AI.');
            console.error('Returning error to the user instead of fake scores.');
            console.error('━'.repeat(60));

            // Instead of returning fake scores, return an error
            return res.status(503).json({
                message: 'AI analysis failed. Please try again.',
                error: geminiError.message.includes('quota')
                    ? 'API quota exceeded. Please wait a few minutes and try again, or upgrade your Gemini API plan.'
                    : geminiError.message.includes('404')
                        ? 'AI model not available. Please contact support.'
                        : `Gemini error: ${geminiError.message.substring(0, 200)}`,
                retryable: true
            });
        }

        // Save assessment to store
        const assessment = store.insert('assessments', {
            candidateId: req.user._id,
            skillName,
            industry,
            overallScore: assessmentData.overallScore,
            passed: assessmentData.passed,
            skillLevel: assessmentData.skillLevel,
            dimensions: assessmentData.dimensions,
            strengths: assessmentData.strengths || [],
            improvements: assessmentData.improvements || [],
            flaws: assessmentData.flaws || [],
            timestamps: assessmentData.timestamps || [],
            employerSummary: assessmentData.employerSummary || '',
            verifiedSkills: assessmentData.verifiedSkills || [],
            videoPath: videoPath,
            analyzedBy: usedModel,
            isGeminiAnalysis: isGeminiAnalysis
        });

        let badge = null;
        // Auto-generate badge if passed
        if (assessmentData.passed && assessmentData.overallScore >= 70) {
            badge = generateBadge(assessment._id, req.user);
            store.updateById('assessments', assessment._id, { badgeId: badge.badgeId });
        }

        console.log(`✅ Assessment saved. ID: ${assessment._id}, Badge: ${badge ? badge.badgeId : 'none'}`);
        console.log('='.repeat(60) + '\n');

        res.status(201).json({
            message: 'Assessment complete',
            assessment: { ...assessment, badgeId: badge ? badge.badgeId : null },
            badgeId: badge ? badge.badgeId : null
        });

    } catch (error) {
        console.error('❌ Assessment error:', error);
        res.status(500).json({ message: 'Assessment failed', error: error.message });
    }
};

/**
 * Validate and normalize the Gemini response to ensure it has all required fields
 */
function validateAndNormalizeAssessment(data, skillName) {
    // Ensure overallScore is a number between 0 and 100
    if (typeof data.overallScore !== 'number' || data.overallScore < 0 || data.overallScore > 100) {
        data.overallScore = Math.max(0, Math.min(100, Number(data.overallScore) || 0));
    }

    // Ensure passed is consistent with score
    data.passed = data.overallScore >= 70;

    // Ensure skillLevel is set correctly based on score
    if (!data.skillLevel || !['Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(data.skillLevel)) {
        if (data.overallScore >= 90) data.skillLevel = 'Expert';
        else if (data.overallScore >= 80) data.skillLevel = 'Advanced';
        else if (data.overallScore >= 60) data.skillLevel = 'Intermediate';
        else data.skillLevel = 'Beginner';
    }

    // Ensure dimensions exist with scores
    if (!data.dimensions || typeof data.dimensions !== 'object') {
        data.dimensions = {};
    }

    const requiredDimensions = ['technicalAccuracy', 'efficiency', 'bestPractices', 'problemSolving'];
    for (const dim of requiredDimensions) {
        if (!data.dimensions[dim]) {
            data.dimensions[dim] = { score: data.overallScore, observation: 'Analysis not available for this dimension.' };
        }
        // Clamp individual dimension scores
        if (typeof data.dimensions[dim].score === 'number') {
            data.dimensions[dim].score = Math.max(0, Math.min(100, data.dimensions[dim].score));
        }
    }

    // Ensure arrays exist
    if (!Array.isArray(data.strengths)) data.strengths = [];
    if (!Array.isArray(data.improvements)) data.improvements = [];
    if (!Array.isArray(data.verifiedSkills)) data.verifiedSkills = [];
    if (!Array.isArray(data.flaws)) data.flaws = [];
    if (!Array.isArray(data.timestamps)) data.timestamps = [];

    // Ensure employerSummary
    if (!data.employerSummary || typeof data.employerSummary !== 'string') {
        data.employerSummary = `Candidate demonstrated ${data.skillLevel.toLowerCase()}-level proficiency in ${skillName} with a score of ${data.overallScore}/100.`;
    }

    return data;
}

module.exports = { assessSkill };
