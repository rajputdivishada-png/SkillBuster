/**
 * SkillProof — Gemini Vision Assessment Prompts
 * Skill-specific rubrics for accurate AI evaluation
 */

const skillRubrics = {
    'React Frontend Development': {
        industry: 'IT / Software',
        dimensions: ['Component Structure', 'Hooks Usage (useState/useEffect)', 'Code Cleanliness', 'Error-Free Execution', 'Responsive Design'],
        specificInstructions: `
      Focus on:
      - Is the component properly structured with clear separation of concerns?
      - Are React hooks (useState, useEffect, useCallback, useMemo) used correctly?
      - Is the code clean, readable, and well-organized?
      - Are there any console errors or warnings visible?
      - Does the candidate show awareness of responsive design principles?
    `
    },
    'Node.js API Development': {
        industry: 'IT / Software',
        dimensions: ['Route Structure', 'Error Handling', 'HTTP Status Codes', 'Security Basics', 'Code Organization'],
        specificInstructions: `
      Focus on:
      - Are routes logically structured with proper HTTP methods (GET, POST, PUT, DELETE)?
      - Is comprehensive error handling present with try/catch blocks?
      - Are appropriate HTTP status codes returned (200, 201, 400, 404, 500)?
      - Are there no hardcoded secrets or credentials visible?
      - Is the code well-organized with controller separation?
    `
    },
    'JavaScript Debugging': {
        industry: 'IT / Software',
        dimensions: ['Root Cause Identification', 'Fix Correctness', 'Console Usage', 'Debugging Speed', 'Explanation Quality'],
        specificInstructions: `
      Focus on:
      - How quickly does the candidate identify the root cause?
      - Is the fix correct and complete?
      - Does the candidate use console.log, debugger, or dev tools effectively?
      - Does the candidate verbalize their debugging process?
      - Is the debugging approach systematic or random?
    `
    },
    'SQL Database Querying': {
        industry: 'IT / Software',
        dimensions: ['Query Correctness', 'Joins/Aggregations', 'Optimization Awareness', 'Schema Understanding', 'Edge Case Handling'],
        specificInstructions: `
      Focus on:
      - Are SQL queries syntactically correct and producing expected results?
      - Are JOINs and aggregations handled correctly?
      - Does the candidate show awareness of query optimization (indexes, EXPLAIN)?
      - Does the candidate understand the database schema?
      - Are edge cases (NULL values, empty sets) considered?
    `
    },
    'Python Scripting': {
        industry: 'IT / Software',
        dimensions: ['Syntax Correctness', 'Function Usage', 'Code Efficiency', 'Library Knowledge', 'Best Practices'],
        specificInstructions: `
      Focus on:
      - Is the Python syntax correct with proper indentation?
      - Are functions used appropriately for code reuse?
      - Is the code efficient (avoiding unnecessary loops, using comprehensions)?
      - Does the candidate know relevant Python libraries?
      - Are Python best practices followed (PEP 8, type hints, docstrings)?
    `
    },
    'DevOps / Docker': {
        industry: 'IT / Software',
        dimensions: ['Dockerfile Correctness', 'Environment Variables', 'Port Configuration', 'Multi-Stage Builds', 'Security Practices'],
        specificInstructions: `
      Focus on:
      - Is the Dockerfile correctly written with proper base image?
      - Are environment variables handled securely (not hardcoded)?
      - Are ports properly exposed and configured?
      - Is multi-stage build awareness shown?
      - Are Docker security best practices followed?
    `
    },
    'Wound Dressing': {
        industry: 'Healthcare',
        dimensions: ['Technique Accuracy', 'Hygiene Protocol', 'Material Selection', 'Patient Communication', 'Speed'],
        specificInstructions: `
      Focus on:
      - Is the wound dressing technique medically correct?
      - Does the candidate follow proper hygiene/sanitation protocols?
      - Are appropriate materials selected for the wound type?
      - Does the candidate communicate with the patient (if applicable)?
      - Is the procedure completed within a reasonable timeframe?
    `
    },
    'Circuit Wiring': {
        industry: 'Electrical / ITI',
        dimensions: ['Wiring Correctness', 'Safety Protocols', 'Tool Usage', 'Circuit Integrity', 'Neatness'],
        specificInstructions: `
      Focus on:
      - Is the wiring done correctly according to the circuit diagram?
      - Are safety protocols followed (power off, insulation, grounding)?
      - Are tools used correctly and safely?
      - Does the completed circuit function as intended?
      - Is the wiring neat and professionally finished?
    `
    }
};

/**
 * Generate a detailed assessment prompt for Gemini Vision
 * @param {string} skillName - The skill being assessed
 * @param {string} industry - The industry category
 * @returns {string} - Complete prompt for Gemini
 */
const getAssessmentPrompt = (skillName, industry) => {
    const rubric = skillRubrics[skillName];
    const specificInstructions = rubric ? rubric.specificInstructions : '';
    const dimensions = rubric ? rubric.dimensions.join(', ') : 'Technical Accuracy, Efficiency, Best Practices, Problem Solving';

    return `You are an expert ${industry} skill assessor with 15 years of experience.

Watch this video carefully. The candidate is demonstrating: ${skillName}

Key evaluation dimensions: ${dimensions}

${specificInstructions}

Evaluate the candidate on these dimensions and return ONLY valid JSON:

{
  "overallScore": <0-100>,
  "passed": <true if score >= 70>,
  "skillLevel": "<Beginner | Intermediate | Advanced | Expert>",
  "dimensions": {
    "technicalAccuracy": { "score": <0-100>, "observation": "<what you saw>" },
    "efficiency": { "score": <0-100>, "observation": "<what you saw>" },
    "bestPractices": { "score": <0-100>, "observation": "<what you saw>" },
    "problemSolving": { "score": <0-100>, "observation": "<what you saw>" }
  },
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<area 1>", "<area 2>"],
  "employerSummary": "<2 sentence plain English summary for a hiring manager>",
  "verifiedSkills": ["<specific skill tag>", "<specific skill tag>"]
}

Be strict. Be honest. A false positive hurts real employers.
Return ONLY the JSON object. No markdown. No explanation. No code fences.`;
};

/**
 * Get all available skill categories
 * @returns {Array} - Array of skill objects
 */
const getSkillCategories = () => {
    return Object.entries(skillRubrics).map(([name, rubric]) => ({
        name,
        industry: rubric.industry,
        dimensions: rubric.dimensions
    }));
};

module.exports = { getAssessmentPrompt, getSkillCategories, skillRubrics };
