import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Award, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';
import { getAssessment } from '../api';

export default function ScoreCardPage() {
    const { assessmentId } = useParams();
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const { data } = await getAssessment(assessmentId);
                setAssessment(data);
            } catch (err) {
                console.error('Failed to fetch assessment:', err);
                setError(err.response?.data?.message || 'Failed to load results');
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [assessmentId]);

    const getScoreColor = (score) => {
        if (score >= 85) return 'var(--accent-emerald)';
        if (score >= 70) return 'var(--accent-gold)';
        return 'var(--accent-rose)';
    };

    const getBarGradient = (score) => {
        if (score >= 85) return 'linear-gradient(90deg, #10b981, #34d399)';
        if (score >= 70) return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
        return 'linear-gradient(90deg, #ef4444, #f87171)';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-text">
                    <span className="gradient-text">Loading your results...</span>
                </p>
            </div>
        );
    }

    if (error || !assessment) {
        return (
            <div className="scorecard" id="scorecard-page">
                <div className="empty-state">
                    <div className="icon"><AlertTriangle size={48} /></div>
                    <h3>{error || 'Results not found'}</h3>
                    <Link to="/record" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Try a New Assessment
                    </Link>
                </div>
            </div>
        );
    }

    const dimensions = [
        { key: 'technicalAccuracy', label: 'Technical Accuracy' },
        { key: 'efficiency', label: 'Efficiency' },
        { key: 'bestPractices', label: 'Best Practices' },
        { key: 'problemSolving', label: 'Problem Solving' }
    ];

    // Find badge ID — might be stored in assessment or we need to look it up
    const badgeId = assessment.badgeId;

    return (
        <div className="scorecard" id="scorecard-page">
            {/* Header */}
            <div className="scorecard-header">
                <h1>Assessment Results</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    {assessment.skillName} • {assessment.industry}
                </p>
                <div className={`status-badge ${assessment.passed ? 'status-passed' : 'status-failed'}`}>
                    {assessment.passed ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    {assessment.passed ? 'Passed — Badge Earned!' : 'Not Passed — Keep Practicing'}
                </div>
            </div>

            {/* Overall Score */}
            <div className="card" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div className="score-circle" style={{ margin: '0 auto 1rem' }}>
                    <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle className="score-circle-bg" cx="60" cy="60" r="52" />
                        <circle
                            className="score-circle-fill"
                            cx="60" cy="60" r="52"
                            stroke={getScoreColor(assessment.overallScore)}
                            strokeDasharray={`${(assessment.overallScore / 100) * 326.7} 326.7`}
                        />
                    </svg>
                    <div className="score-circle-text" style={{ color: getScoreColor(assessment.overallScore) }}>
                        {assessment.overallScore}
                    </div>
                </div>
                <span className={`badge-level badge-level-${assessment.skillLevel?.toLowerCase()}`}>
                    {assessment.skillLevel}
                </span>
                <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', maxWidth: '500px', margin: '1rem auto 0' }}>
                    {assessment.employerSummary}
                </p>
            </div>

            {/* Dimensions */}
            <div className="dimensions-grid">
                {dimensions.map(({ key, label }) => {
                    const dim = assessment.dimensions?.[key];
                    if (!dim) return null;
                    return (
                        <div className="dimension-card" key={key}>
                            <div className="dimension-header">
                                <span className="dimension-name">{label}</span>
                                <span className="dimension-score" style={{ color: getScoreColor(dim.score) }}>
                                    {dim.score}
                                </span>
                            </div>
                            <div className="score-bar">
                                <div
                                    className="score-bar-fill"
                                    style={{ width: `${dim.score}%`, background: getBarGradient(dim.score) }}
                                ></div>
                            </div>
                            <p className="dimension-observation">{dim.observation}</p>
                        </div>
                    );
                })}
            </div>

            {/* Strengths & Improvements */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                <div className="feedback-section">
                    <h3><TrendingUp size={20} style={{ color: 'var(--accent-emerald)' }} /> Strengths</h3>
                    <ul className="feedback-list strengths">
                        {assessment.strengths?.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div className="feedback-section">
                    <h3><AlertTriangle size={20} style={{ color: 'var(--accent-gold)' }} /> Areas to Improve</h3>
                    <ul className="feedback-list improvements">
                        {assessment.improvements?.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Verified Skills */}
            {assessment.verifiedSkills?.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1rem' }}>
                        Verified Skills
                    </h3>
                    <div className="badge-tags" style={{ justifyContent: 'flex-start' }}>
                        {assessment.verifiedSkills.map((skill, i) => (
                            <span className="skill-tag" key={i}>{skill}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
                {assessment.passed && badgeId && (
                    <Link to={`/badge/${badgeId}`} className="btn btn-gold">
                        <Award size={18} /> View Your Badge
                    </Link>
                )}
                <Link to="/record" className="btn btn-secondary">
                    Record Another Task <ArrowRight size={18} />
                </Link>
                <Link to="/dashboard" className="btn btn-secondary">
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
