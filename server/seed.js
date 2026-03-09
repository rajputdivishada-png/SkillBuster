/**
 * Seed script — Creates demo candidates, assessments, and badges
 * Run: node seed.js
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { store } = require('./store');

const seedData = async () => {
    try {
        console.log('🌱 Seeding demo data...\n');

        // Clear existing data
        store.deleteAll('users');
        store.deleteAll('assessments');
        store.deleteAll('badges');
        console.log('Cleared existing data');

        // Hash password once for all demo users
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // Create employer accounts
        const employers = [
            store.insert('users', { name: 'TechCorp HR', email: 'hr@techcorp.com', password: hashedPassword, role: 'employer', skills: [], bio: '' }),
            store.insert('users', { name: 'StartupX Hiring', email: 'hire@startupx.com', password: hashedPassword, role: 'employer', skills: [], bio: '' })
        ];
        console.log(`Created ${employers.length} employer accounts`);

        // Create candidate accounts
        const candidateData = [
            { name: 'Aarav Sharma', email: 'aarav@example.com', skills: ['React', 'Node.js', 'TypeScript'] },
            { name: 'Priya Patel', email: 'priya@example.com', skills: ['Python', 'Django', 'SQL'] },
            { name: 'Rahul Kumar', email: 'rahul@example.com', skills: ['Docker', 'AWS', 'Linux'] },
            { name: 'Sneha Reddy', email: 'sneha@example.com', skills: ['React', 'Vue.js', 'CSS'] },
            { name: 'Vikram Singh', email: 'vikram@example.com', skills: ['Node.js', 'Express', 'MongoDB'] },
            { name: 'Ananya Gupta', email: 'ananya@example.com', skills: ['Python', 'TensorFlow', 'Data Analysis'] },
            { name: 'Karthik Nair', email: 'karthik@example.com', skills: ['Java', 'Spring Boot', 'Microservices'] },
            { name: 'Meera Joshi', email: 'meera@example.com', skills: ['JavaScript', 'Debugging', 'Testing'] },
            { name: 'Arjun Das', email: 'arjun@example.com', skills: ['SQL', 'PostgreSQL', 'Data Modeling'] },
            { name: 'Divya Menon', email: 'divya@example.com', skills: ['DevOps', 'Docker', 'Kubernetes'] }
        ];

        const candidates = candidateData.map(c =>
            store.insert('users', { ...c, password: hashedPassword, role: 'candidate', bio: '' })
        );
        console.log(`Created ${candidates.length} candidate accounts`);

        // Assessment templates
        const templates = [
            {
                ci: 0, skillName: 'React Frontend Development', industry: 'IT / Software',
                overallScore: 92, passed: true, skillLevel: 'Expert',
                dimensions: {
                    technicalAccuracy: { score: 95, observation: 'Excellent component architecture with proper separation of concerns.' },
                    efficiency: { score: 88, observation: 'Efficient use of useMemo and useCallback for performance optimization.' },
                    bestPractices: { score: 93, observation: 'Followed React best practices including proper key usage.' },
                    problemSolving: { score: 90, observation: 'Demonstrated creative problem-solving in form validation.' }
                },
                strengths: ['Excellent component architecture', 'Strong hooks knowledge', 'Clean and readable code'],
                improvements: ['Could add more TypeScript type annotations', 'Consider implementing error boundaries'],
                employerSummary: 'Highly skilled React developer demonstrating expert-level component design. Recommended for senior frontend roles.',
                verifiedSkills: ['React.js', 'Hooks', 'Component Design', 'State Management', 'CSS Modules']
            },
            {
                ci: 1, skillName: 'Python Scripting', industry: 'IT / Software',
                overallScore: 85, passed: true, skillLevel: 'Advanced',
                dimensions: {
                    technicalAccuracy: { score: 88, observation: 'Clean Python syntax with proper data structures.' },
                    efficiency: { score: 82, observation: 'Good use of list comprehensions and generators.' },
                    bestPractices: { score: 86, observation: 'Follows PEP 8 conventions with docstrings and type hints.' },
                    problemSolving: { score: 84, observation: 'Methodical problem breakdown with good helper functions.' }
                },
                strengths: ['Clean Pythonic code', 'Strong data structures understanding', 'Good documentation habits'],
                improvements: ['Explore more advanced libraries', 'Consider adding unit tests'],
                employerSummary: 'Proficient Python developer with strong fundamentals. Well-suited for backend development roles.',
                verifiedSkills: ['Python 3', 'Data Structures', 'PEP 8', 'File I/O', 'Functions']
            },
            {
                ci: 2, skillName: 'DevOps / Docker', industry: 'IT / Software',
                overallScore: 88, passed: true, skillLevel: 'Advanced',
                dimensions: {
                    technicalAccuracy: { score: 90, observation: 'Well-structured Dockerfile with multi-stage build.' },
                    efficiency: { score: 85, observation: 'Good layer caching strategy with alpine base.' },
                    bestPractices: { score: 89, observation: 'Environment variables handled via .env files securely.' },
                    problemSolving: { score: 87, observation: 'Quickly resolved port binding issues.' }
                },
                strengths: ['Multi-stage Docker builds', 'Security-conscious practices', 'Docker Compose proficiency'],
                improvements: ['Could implement health checks', 'Consider container orchestration patterns'],
                employerSummary: 'Strong DevOps engineer with solid Docker skills and security awareness. Ready for infrastructure roles.',
                verifiedSkills: ['Docker', 'Dockerfile', 'Docker Compose', 'Container Security', 'CI/CD']
            },
            {
                ci: 3, skillName: 'React Frontend Development', industry: 'IT / Software',
                overallScore: 78, passed: true, skillLevel: 'Intermediate',
                dimensions: {
                    technicalAccuracy: { score: 80, observation: 'Good component structure but some unnecessary re-renders.' },
                    efficiency: { score: 75, observation: 'Could benefit from React.memo and useMemo.' },
                    bestPractices: { score: 79, observation: 'Generally follows React conventions. Missing prop-types.' },
                    problemSolving: { score: 78, observation: 'Able to solve problems but took longer on state lifting.' }
                },
                strengths: ['Good visual design sense', 'Clean JSX structure', 'Responsive CSS skills'],
                improvements: ['Optimize re-render performance', 'Add type checking', 'Learn custom hooks'],
                employerSummary: 'Competent React developer with good fundamentals. Has potential for growth with mentoring.',
                verifiedSkills: ['React.js', 'CSS', 'Responsive Design', 'JSX']
            },
            {
                ci: 4, skillName: 'Node.js API Development', industry: 'IT / Software',
                overallScore: 91, passed: true, skillLevel: 'Expert',
                dimensions: {
                    technicalAccuracy: { score: 93, observation: 'Excellent REST API design with proper HTTP methods.' },
                    efficiency: { score: 89, observation: 'Efficient middleware pipeline with proper async/await.' },
                    bestPractices: { score: 92, observation: 'Comprehensive error handling and input validation.' },
                    problemSolving: { score: 90, observation: 'Quickly set up auth middleware and role-based access.' }
                },
                strengths: ['RESTful API design mastery', 'Robust error handling', 'Security-first approach'],
                improvements: ['Could add API rate limiting', 'Consider implementing API versioning'],
                employerSummary: 'Expert Node.js backend developer with production-ready coding practices. Highly recommended.',
                verifiedSkills: ['Node.js', 'Express.js', 'REST API', 'JWT Auth', 'MongoDB']
            },
            {
                ci: 5, skillName: 'Python Scripting', industry: 'IT / Software',
                overallScore: 74, passed: true, skillLevel: 'Intermediate',
                dimensions: {
                    technicalAccuracy: { score: 76, observation: 'Correct Python syntax with some minor style inconsistencies.' },
                    efficiency: { score: 72, observation: 'Functional code but could use more Pythonic constructs.' },
                    bestPractices: { score: 75, observation: 'Basic PEP 8 compliance. Missing type hints.' },
                    problemSolving: { score: 73, observation: 'Solved the task but approach could be more elegant.' }
                },
                strengths: ['Good problem decomposition', 'Working knowledge of pandas', 'Logical thinking'],
                improvements: ['Learn Pythonic idioms', 'Add comprehensive error handling', 'Explore testing frameworks'],
                employerSummary: 'Growing Python developer with solid basics. Suitable for junior data analysis roles.',
                verifiedSkills: ['Python 3', 'Pandas', 'Data Analysis', 'Scripting']
            },
            {
                ci: 6, skillName: 'Node.js API Development', industry: 'IT / Software',
                overallScore: 82, passed: true, skillLevel: 'Advanced',
                dimensions: {
                    technicalAccuracy: { score: 84, observation: 'Well-structured API with MVC pattern.' },
                    efficiency: { score: 80, observation: 'Good async handling. Some query optimization opportunities.' },
                    bestPractices: { score: 83, observation: 'Proper middleware usage and error handling.' },
                    problemSolving: { score: 81, observation: 'Efficiently implemented CRUD with validation.' }
                },
                strengths: ['Clean MVC architecture', 'Good Express middleware usage', 'Database integration skills'],
                improvements: ['Add input sanitization', 'Implement caching layer', 'Add API documentation'],
                employerSummary: 'Solid backend developer with good architectural sense. Ready for mid-level roles.',
                verifiedSkills: ['Node.js', 'Express.js', 'MongoDB', 'REST API', 'MVC']
            },
            {
                ci: 7, skillName: 'JavaScript Debugging', industry: 'IT / Software',
                overallScore: 87, passed: true, skillLevel: 'Advanced',
                dimensions: {
                    technicalAccuracy: { score: 90, observation: 'Correctly identified the root cause using DevTools.' },
                    efficiency: { score: 85, observation: 'Efficient debugging with strategic breakpoint placement.' },
                    bestPractices: { score: 86, observation: 'Used console methods beyond console.log.' },
                    problemSolving: { score: 88, observation: 'Systematic elimination approach. Clear thought process.' }
                },
                strengths: ['Excellent DevTools proficiency', 'Systematic debugging approach', 'Clear communication'],
                improvements: ['Could use source maps more effectively', 'Consider using debugging extensions'],
                employerSummary: 'Strong debugging skills with systematic approach. Valuable for code quality roles.',
                verifiedSkills: ['JavaScript', 'Chrome DevTools', 'Debugging', 'Error Analysis', 'Testing']
            },
            {
                ci: 8, skillName: 'SQL Database Querying', industry: 'IT / Software',
                overallScore: 90, passed: true, skillLevel: 'Advanced',
                dimensions: {
                    technicalAccuracy: { score: 92, observation: 'All queries produced correct results. Complex JOINs handled.' },
                    efficiency: { score: 88, observation: 'Good awareness of index usage with EXPLAIN.' },
                    bestPractices: { score: 91, observation: 'Proper aliasing, formatting, and parameterized queries.' },
                    problemSolving: { score: 89, observation: 'Creatively solved aggregation with window functions.' }
                },
                strengths: ['Expert JOIN handling', 'Query optimization awareness', 'Window functions knowledge'],
                improvements: ['Explore CTE patterns more', 'Consider materialized views'],
                employerSummary: 'Excellent SQL skills with deep query optimization understanding. Ideal for data engineering.',
                verifiedSkills: ['SQL', 'PostgreSQL', 'Query Optimization', 'JOINs', 'Window Functions']
            },
            {
                ci: 9, skillName: 'DevOps / Docker', industry: 'IT / Software',
                overallScore: 80, passed: true, skillLevel: 'Intermediate',
                dimensions: {
                    technicalAccuracy: { score: 82, observation: 'Dockerfile works correctly with proper base image.' },
                    efficiency: { score: 78, observation: 'Image could be further optimized. Some redundant layers.' },
                    bestPractices: { score: 81, observation: 'Env vars used but some hardcoded paths detected.' },
                    problemSolving: { score: 79, observation: 'Resolved container networking issues with docs.' }
                },
                strengths: ['Good Docker fundamentals', 'Docker Compose basic proficiency', 'Willingness to learn'],
                improvements: ['Optimize Docker layers', 'Remove hardcoded values', 'Learn container orchestration'],
                employerSummary: 'Developing DevOps engineer with solid Docker basics. Good for junior DevOps roles.',
                verifiedSkills: ['Docker', 'Docker Compose', 'Linux', 'Containerization']
            }
        ];

        for (const t of templates) {
            const candidate = candidates[t.ci];

            const assessment = store.insert('assessments', {
                candidateId: candidate._id,
                skillName: t.skillName,
                industry: t.industry,
                overallScore: t.overallScore,
                passed: t.passed,
                skillLevel: t.skillLevel,
                dimensions: t.dimensions,
                strengths: t.strengths,
                improvements: t.improvements,
                employerSummary: t.employerSummary,
                verifiedSkills: t.verifiedSkills,
                videoPath: ''
            });

            const badge = store.insert('badges', {
                badgeId: uuidv4(),
                candidateId: candidate._id,
                assessmentId: assessment._id,
                candidateName: candidate.name,
                skillName: t.skillName,
                industry: t.industry,
                overallScore: t.overallScore,
                skillLevel: t.skillLevel,
                verifiedSkills: t.verifiedSkills,
                employerSummary: t.employerSummary,
                issuedAt: new Date().toISOString()
            });

            store.updateById('assessments', assessment._id, { badgeId: badge._id });

            console.log(`  ✅ ${candidate.name} — ${t.skillName} (Score: ${t.overallScore}, Badge: ${badge.badgeId})`);
        }

        console.log('\n🎉 Seeding complete!');
        console.log('\n📋 Demo Login Credentials:');
        console.log('  Employer: hr@techcorp.com / password123');
        console.log('  Candidate: aarav@example.com / password123');

    } catch (error) {
        console.error('Seeding error:', error);
    }
};

seedData();
