import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { searchCandidates } from '../api';
import { QRCodeSVG } from 'qrcode.react';
import {
    Search, Users, Award, TrendingUp, AlertTriangle,
    Mail, X, ExternalLink, Filter, Briefcase, ChevronDown
} from 'lucide-react';

const skillLevels = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
const skillOptions = [
    '', 'React Frontend Development', 'Node.js API Development',
    'JavaScript Debugging', 'SQL Database Querying',
    'Python Scripting', 'DevOps / Docker'
];

export default function EmployerDashboard() {
    const { user } = useAuth();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchSkill, setSearchSkill] = useState('');
    const [minScore, setMinScore] = useState('');
    const [level, setLevel] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const params = {};
            if (searchSkill) params.skill = searchSkill;
            if (minScore) params.minScore = minScore;
            if (level) params.level = level;

            const { data } = await searchCandidates(params);
            setCandidates(data);
        } catch (err) {
            console.error('Failed to search candidates:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCandidates();
    };

    const getScoreClass = (score) => {
        if (score >= 85) return 'score-high';
        if (score >= 70) return 'score-medium';
        return 'score-low';
    };

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

    return (
        <div className="dashboard" id="employer-dashboard">
            <div className="dashboard-header">
                <h1>Employer Dashboard</h1>
                <p>Find verified, AI-assessed candidates for your team</p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="search-bar" id="candidate-search">
                <select
                    className="form-select"
                    value={searchSkill}
                    onChange={(e) => setSearchSkill(e.target.value)}
                    id="search-skill"
                >
                    <option value="">All Skills</option>
                    {skillOptions.filter(Boolean).map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <input
                    type="number"
                    className="form-input"
                    placeholder="Min Score (0-100)"
                    value={minScore}
                    onChange={(e) => setMinScore(e.target.value)}
                    min="0"
                    max="100"
                    id="search-min-score"
                />
                <select
                    className="form-select"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    id="search-level"
                >
                    <option value="">All Levels</option>
                    {skillLevels.filter(Boolean).map(l => (
                        <option key={l} value={l}>{l}</option>
                    ))}
                </select>
                <button type="submit" className="btn btn-primary" id="search-submit">
                    <Search size={18} /> Search
                </button>
            </form>

            {/* Results Count */}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                <Users size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                {candidates.length} verified candidate{candidates.length !== 1 ? 's' : ''} found
            </p>

            {/* Candidates Grid */}
            {loading ? (
                <div className="loading-container" style={{ minHeight: '30vh' }}>
                    <div className="spinner"></div>
                    <p className="loading-text">Searching candidates...</p>
                </div>
            ) : candidates.length === 0 ? (
                <div className="empty-state">
                    <div className="icon"><Search size={48} /></div>
                    <h3>No candidates found</h3>
                    <p>Try adjusting your search filters</p>
                </div>
            ) : (
                <div className="dashboard-grid">
                    {candidates.map((item, i) => (
                        <div className="candidate-card" key={i}>
                            <div className="candidate-header">
                                <div className="candidate-info">
                                    <h3>{item.candidate.name}</h3>
                                    <p className="candidate-skill">{item.assessment.skillName}</p>
                                </div>
                                <span className={`candidate-score-badge ${getScoreClass(item.assessment.overallScore)}`}>
                                    {item.assessment.overallScore}
                                </span>
                            </div>

                            <span className={`badge-level badge-level-${item.assessment.skillLevel?.toLowerCase()}`}>
                                {item.assessment.skillLevel}
                            </span>

                            <div className="badge-tags" style={{ justifyContent: 'flex-start', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                                {item.assessment.verifiedSkills?.slice(0, 3).map((skill, j) => (
                                    <span className="skill-tag" key={j}>{skill}</span>
                                ))}
                            </div>

                            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem', fontStyle: 'italic' }}>
                                "{item.assessment.employerSummary}"
                            </p>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => setSelectedCandidate(item)}
                                    style={{ flex: 1 }}
                                >
                                    View Full Report
                                </button>
                                {item.badgeId && (
                                    <Link to={`/verify/${item.badgeId}`} className="btn btn-secondary btn-sm">
                                        <ExternalLink size={14} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {selectedCandidate && (
                <div className="modal-overlay" onClick={() => setSelectedCandidate(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedCandidate.candidate.name}</h2>
                            <button className="modal-close" onClick={() => setSelectedCandidate(null)}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Score Overview */}
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem' }}>
                            <div className="score-circle">
                                <svg width="120" height="120" viewBox="0 0 120 120">
                                    <circle className="score-circle-bg" cx="60" cy="60" r="52" />
                                    <circle
                                        className="score-circle-fill"
                                        cx="60" cy="60" r="52"
                                        stroke={getScoreColor(selectedCandidate.assessment.overallScore)}
                                        strokeDasharray={`${(selectedCandidate.assessment.overallScore / 100) * 326.7} 326.7`}
                                    />
                                </svg>
                                <div className="score-circle-text" style={{ color: getScoreColor(selectedCandidate.assessment.overallScore) }}>
                                    {selectedCandidate.assessment.overallScore}
                                </div>
                            </div>
                            <div>
                                <p style={{ color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '0.25rem' }}>
                                    {selectedCandidate.assessment.skillName}
                                </p>
                                <span className={`badge-level badge-level-${selectedCandidate.assessment.skillLevel?.toLowerCase()}`}>
                                    {selectedCandidate.assessment.skillLevel}
                                </span>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                    Assessed: {new Date(selectedCandidate.assessment.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Dimensions */}
                        {Object.entries(selectedCandidate.assessment.dimensions || {}).map(([key, dim]) => (
                            <div key={key} style={{ marginBottom: '1rem' }}>
                                <div className="dimension-header">
                                    <span className="dimension-name" style={{ textTransform: 'capitalize' }}>
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                    <span className="dimension-score" style={{ color: getScoreColor(dim.score) }}>
                                        {dim.score}
                                    </span>
                                </div>
                                <div className="score-bar">
                                    <div className="score-bar-fill" style={{ width: `${dim.score}%`, background: getBarGradient(dim.score) }}></div>
                                </div>
                                <p className="dimension-observation">{dim.observation}</p>
                            </div>
                        ))}

                        {/* Strengths & Improvements */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.5rem 0' }}>
                            <div>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <TrendingUp size={14} style={{ color: 'var(--accent-emerald)' }} /> Strengths
                                </h4>
                                <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1rem', lineHeight: 1.8 }}>
                                    {selectedCandidate.assessment.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <AlertTriangle size={14} style={{ color: 'var(--accent-gold)' }} /> To Improve
                                </h4>
                                <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1rem', lineHeight: 1.8 }}>
                                    {selectedCandidate.assessment.improvements?.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                        </div>

                        {/* Verified Skills */}
                        <div className="badge-tags" style={{ justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
                            {selectedCandidate.assessment.verifiedSkills?.map((skill, i) => (
                                <span className="skill-tag" key={i}>{skill}</span>
                            ))}
                        </div>

                        {/* Contact Button */}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <a
                                href={`mailto:${selectedCandidate.candidate.email}`}
                                className="btn btn-gold btn-sm"
                            >
                                <Mail size={16} /> Contact: {selectedCandidate.candidate.email}
                            </a>
                            {selectedCandidate.badgeId && (
                                <Link
                                    to={`/verify/${selectedCandidate.badgeId}`}
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => setSelectedCandidate(null)}
                                >
                                    <Award size={16} /> View Badge
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
