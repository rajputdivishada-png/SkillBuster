/**
 * SkillProof — Gemini Vision Assessment Prompts
 * Strict, video-aware rubrics for accurate AI evaluation
 * 
 * Key design principles:
 * 1. Gemini must DESCRIBE what it sees in the video before scoring
 * 2. Scores must be justified by specific observations
 * 3. Flaws in technique must be explicitly called out with timestamps
 * 4. Low scores are valid — not every candidate passes
 */

const skillRubrics = {
  'React Frontend Development': {
    industry: 'IT / Software',
    dimensions: ['Component Structure', 'Hooks Usage (useState/useEffect)', 'Code Cleanliness', 'Error-Free Execution', 'Responsive Design'],
    specificInstructions: `
WHAT TO WATCH FOR IN THE VIDEO:
- Look at the actual code being written on screen
- Check if the candidate creates proper functional components with clear separation
- Watch for correct usage of React hooks (useState, useEffect, useCallback, useMemo)
- Notice if there are any red error indicators in the terminal or browser console
- Check if the code follows naming conventions (camelCase, PascalCase for components)
- See if the candidate tests their code in the browser

COMMON FLAWS TO DETECT:
- Using class components instead of functional components (outdated pattern)
- Missing dependency arrays in useEffect (causes infinite renders)
- Mutating state directly instead of using setter functions
- Not handling loading/error states
- Hardcoded values instead of props
- Missing key prop in list rendering
- Not cleaning up side effects in useEffect
    `
  },
  'Node.js API Development': {
    industry: 'IT / Software',
    dimensions: ['Route Structure', 'Error Handling', 'HTTP Status Codes', 'Security Basics', 'Code Organization'],
    specificInstructions: `
WHAT TO WATCH FOR IN THE VIDEO:
- Look at the actual Express routes being created
- Check HTTP methods used (GET for reading, POST for creating, etc.)
- Watch if the candidate adds try/catch error handling
- Notice if proper status codes are used (200, 201, 400, 404, 500)
- See if credentials or API keys are hardcoded in the code

COMMON FLAWS TO DETECT:
- Not using try/catch for async operations
- Using GET for data mutation operations
- Returning 200 for everything (even errors)
- No input validation on request body
- SQL/NoSQL injection vulnerabilities (unsanitized input)
- Hardcoded credentials or API keys visible in code
- Not using environment variables
- Missing CORS configuration
- Synchronous blocking operations in async handlers
    `
  },
  'JavaScript Debugging': {
    industry: 'IT / Software',
    dimensions: ['Root Cause Identification', 'Fix Correctness', 'Console Usage', 'Debugging Speed', 'Explanation Quality'],
    specificInstructions: `
WHAT TO WATCH FOR IN THE VIDEO:
- How quickly does the candidate spot the bug?
- What debugging tools do they use? (console.log, debugger, DevTools)
- Do they read the error message carefully or just guess randomly?
- Is the fix correct and complete?
- Do they verify the fix works by testing?

COMMON FLAWS TO DETECT:
- Random trial-and-error instead of systematic debugging
- Ignoring error messages and stack traces
- Fixing symptoms instead of root causes
- Not testing the fix after applying it
- Using excessive console.log instead of breakpoints
- Not understanding the error type (TypeError vs ReferenceError etc.)
    `
  },
  'SQL Database Querying': {
    industry: 'IT / Software',
    dimensions: ['Query Correctness', 'Joins/Aggregations', 'Optimization Awareness', 'Schema Understanding', 'Edge Case Handling'],
    specificInstructions: `
WHAT TO WATCH FOR IN THE VIDEO:
- Are the SQL queries syntactically correct?
- Do queries return the expected results?
- Are JOINs used correctly (INNER, LEFT, RIGHT)?
- Does the candidate consider query performance?
- Are NULL values and edge cases handled?

COMMON FLAWS TO DETECT:
- SELECT * instead of specific columns
- Cartesian products from missing JOIN conditions
- Not using parameterized queries (SQL injection risk)
- Ignoring NULL in comparisons
- Missing GROUP BY with aggregate functions
- Not considering indexes
- Subqueries where JOINs would be more efficient
    `
  },
  'Python Scripting': {
    industry: 'IT / Software',
    dimensions: ['Syntax Correctness', 'Function Usage', 'Code Efficiency', 'Library Knowledge', 'Best Practices'],
    specificInstructions: `
WHAT TO WATCH FOR IN THE VIDEO:
- Is the Python code syntactically correct?
- Does the candidate use functions for reusable logic?
- Are appropriate Python libraries used?
- Is the code efficient (list comprehensions, generators)?
- Does the code follow PEP 8 style guidelines?

COMMON FLAWS TO DETECT:
- Using loops where list comprehensions would be cleaner
- Not using context managers (with statement) for file operations
- Mutable default arguments in function definitions
- Not handling exceptions properly
- Import * usage
- Global variable dependency
- Not using f-strings (using + for string concatenation)
    `
  },
  'DevOps / Docker': {
    industry: 'IT / Software',
    dimensions: ['Dockerfile Correctness', 'Environment Variables', 'Port Configuration', 'Multi-Stage Builds', 'Security Practices'],
    specificInstructions: `
WHAT TO WATCH FOR IN THE VIDEO:
- Is the Dockerfile written correctly?
- Is an appropriate base image selected?
- Are environment variables used instead of hardcoded values?
- Is port exposure correct?
- Is .dockerignore used to exclude unnecessary files?

COMMON FLAWS TO DETECT:
- Using latest tag for base images (non-reproducible builds)
- Running as root user inside the container
- Not using multi-stage builds for compiled languages
- COPY . . without .dockerignore (copying node_modules, .git)
- Not ordering layers for optimal caching (COPY package.json before source)
- Hardcoded secrets in Dockerfile
- Using ADD instead of COPY for simple file copying
    `
  },
  'Wound Dressing': {
    industry: 'Healthcare',
    dimensions: ['Technique Accuracy', 'Hygiene Protocol', 'Material Selection', 'Patient Communication', 'Speed'],
    specificInstructions: `
WHAT TO WATCH FOR IN THE VIDEO:
- Does the candidate wash/sanitize hands before starting?
- Is the wound area properly cleaned before dressing?
- Is the correct dressing type selected for the wound type?
- Are sterile gloves used throughout?
- Is the dressing secured properly without being too tight?

COMMON FLAWS TO DETECT:
- Not washing hands or wearing gloves
- Touching the sterile side of the dressing
- Applying dressing too tightly or too loosely
- Not cleaning the wound before applying dressing
- Using the wrong type of dressing material
- Cross-contamination of sterile supplies
- Not checking circulation after applying dressing
    `
  },
  'Circuit Wiring': {
    industry: 'Electrical / ITI',
    dimensions: ['Wiring Correctness', 'Safety Protocols', 'Tool Usage', 'Circuit Integrity', 'Neatness'],
    specificInstructions: `
WHAT TO WATCH FOR IN THE VIDEO:
- Is the power source disconnected before starting work?
- Are proper tools used (wire stripper, crimper, multimeter)?
- Do the wire connections match the circuit diagram?
- Is the wiring neat and organized?
- Does the candidate test the circuit after completion?

COMMON FLAWS TO DETECT:
- Working on live circuits without disconnecting power
- Using incorrect wire gauge for the current rating
- Loose or exposed wire connections
- Not using proper insulation or electrical tape
- Incorrect polarity connections
- Not using proper grounding
- Messy, tangled wiring
    `
  }
};

/**
 * Generate a detailed assessment prompt for Gemini Vision
 * This prompt forces Gemini to analyze the actual video content
 */
const getAssessmentPrompt = (skillName, industry) => {
  const rubric = skillRubrics[skillName];
  const specificInstructions = rubric ? rubric.specificInstructions : '';
  const dimensions = rubric ? rubric.dimensions.join(', ') : 'Technical Accuracy, Efficiency, Best Practices, Problem Solving';

  return `You are a strict, expert ${industry} skill assessor with 15 years of professional experience.

CRITICAL INSTRUCTIONS — READ CAREFULLY:

1. You MUST carefully watch every frame of this video before responding.
2. You MUST base your scores ONLY on what you actually observe in the video.
3. If the video does NOT show the skill "${skillName}" being performed, give a LOW score (below 30) and explain why.
4. If the video is blank, corrupted, too short, or irrelevant, score it 0-10 and say so.
5. Do NOT give high scores by default. A passing score (≥70) means the candidate is genuinely competent.
6. Do NOT inflate scores. Be honest. A false positive hurts real employers.

THE CANDIDATE IS SUPPOSEDLY DEMONSTRATING: ${skillName}
INDUSTRY: ${industry}

KEY EVALUATION DIMENSIONS: ${dimensions}

${specificInstructions}

STEP 1: First, describe what you ACTUALLY SEE in the video in 2-3 sentences. What is the person doing? What tools/code/actions are visible?

STEP 2: Based ONLY on what you described, evaluate and score.

STEP 3: Identify SPECIFIC FLAWS in the technique with approximate timestamps (e.g., "at 0:45, the candidate...")

Return ONLY valid JSON in this exact format:

{
  "videoDescription": "<2-3 sentences describing what you actually see in the video>",
  "isRelevantToSkill": <true if the video content matches the claimed skill "${skillName}", false if not>,
  "overallScore": <0-100, where 0=irrelevant/blank, 30=poor, 50=below average, 70=competent, 85=strong, 95+=exceptional>,
  "passed": <true ONLY if score >= 70 AND video is relevant to the skill>,
  "skillLevel": "<Beginner | Intermediate | Advanced | Expert>",
  "dimensions": {
    "technicalAccuracy": { "score": <0-100>, "observation": "<specific thing you saw that justifies this score>" },
    "efficiency": { "score": <0-100>, "observation": "<specific thing you saw that justifies this score>" },
    "bestPractices": { "score": <0-100>, "observation": "<specific thing you saw that justifies this score>" },
    "problemSolving": { "score": <0-100>, "observation": "<specific thing you saw that justifies this score>" }
  },
  "flaws": [
    { "timestamp": "<approx time, e.g. 0:30>", "description": "<specific technique flaw observed>", "severity": "<minor | major | critical>", "suggestion": "<how to fix this>" }
  ],
  "strengths": ["<specific strength observed in the video>", "<another strength>"],
  "improvements": ["<specific actionable improvement>", "<another improvement>"],
  "employerSummary": "<2-3 sentence summary for a hiring manager: what the candidate did well and where they fell short>",
  "verifiedSkills": ["<specific skill tag ONLY if actually demonstrated>"],
  "timestamps": [
    { "time": "<e.g. 0:15>", "event": "<what happened at this time>" }
  ]
}

SCORING GUIDE:
- 0-10: Video is blank, corrupted, or completely irrelevant
- 11-30: Video shows something but NOT the claimed skill
- 31-50: Skill is attempted but with major errors
- 51-69: Decent attempt but missing key competencies
- 70-79: Competent — meets minimum professional standard
- 80-89: Strong — above average skill demonstration
- 90-100: Exceptional — expert-level mastery with no significant flaws

Return ONLY the JSON object. No markdown. No explanation. No code fences.`;
};

/**
 * Get all available skill categories
 */
const getSkillCategories = () => {
  return Object.entries(skillRubrics).map(([name, rubric]) => ({
    name,
    industry: rubric.industry,
    dimensions: rubric.dimensions
  }));
};

module.exports = { getAssessmentPrompt, getSkillCategories, skillRubrics };
