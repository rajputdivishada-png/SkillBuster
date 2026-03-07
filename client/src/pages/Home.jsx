import { Link } from 'react-router-dom';
import {
    Video, Shield, Award, Search, Zap, Users,
    Monitor, Stethoscope, Wrench, UtensilsCrossed, HardHat,
    ArrowRight, Sparkles
} from 'lucide-react';

const industries = [
    { icon: <Monitor size={32} />, name: 'IT / Software', desc: 'Build, debug, deploy', color: 'purple' },
    { icon: <Stethoscope size={32} />, name: 'Healthcare', desc: 'Medical procedures', color: 'emerald' },
    { icon: <Wrench size={32} />, name: 'Electrical / ITI', desc: 'Wiring & circuits', color: 'gold' },
    { icon: <UtensilsCrossed size={32} />, name: 'Hospitality', desc: 'Service & plating', color: 'rose' },
    { icon: <HardHat size={32} />, name: 'Construction', desc: 'Hands-on trades', color: 'cyan' }
];

const steps = [
    { icon: <Video size={28} />, title: 'Record Your Task', desc: 'Record yourself completing a real skill task — coding, wiring, medical procedures, anything.' },
    { icon: <Sparkles size={28} />, title: 'AI Evaluates You', desc: 'Gemini Vision AI watches your video and scores your technique, efficiency, and best practices.' },
    { icon: <Award size={28} />, title: 'Get Verified Badge', desc: 'Score 70%+ and earn a tamper-proof digital badge with QR code that employers can instantly verify.' }
];

export default function Home() {
    return (
        <>
            {/* Hero Section */}
            <section className="hero" id="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <Sparkles size={16} />
                        AI-Powered Skill Verification
                    </div>
                    <h1>
                        Your Skills.<br />
                        <span className="gradient-text">Proven.</span>{' '}
                        <span className="gold-text">Not Claimed.</span>
                    </h1>
                    <p className="hero-subtitle">
                        Record a 5-minute task. Get AI-verified by Gemini Vision.
                        Earn a digital badge employers trust. No fake certificates, ever.
                    </p>
                    <div className="hero-cta">
                        <Link to="/register?role=candidate" className="btn btn-primary btn-lg" id="cta-candidate">
                            I'm a Candidate <ArrowRight size={20} />
                        </Link>
                        <Link to="/register?role=employer" className="btn btn-secondary btn-lg" id="cta-employer">
                            I'm an Employer <Search size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Demo Banner */}
            <section className="section" style={{ paddingTop: '2rem', paddingBottom: '0' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div className="demo-banner" id="demo-banner">
                        <span className="demo-icon">🔴</span>
                        <div>
                            <strong>Live Demo:</strong> Upload any screen recording and watch Gemini assess it in real time.
                            No pre-recorded results — everything happens live on stage.
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="section" id="how-it-works">
                <div className="section-header">
                    <h2>How It <span className="gradient-text">Works</span></h2>
                    <p>Three simple steps from skill demonstration to verified credential</p>
                </div>
                <div className="steps-grid">
                    {steps.map((step, i) => (
                        <div className="card step-card" key={i}>
                            <div className="step-number">{i + 1}</div>
                            <div className="card-icon card-icon-purple">
                                {step.icon}
                            </div>
                            <h3>{step.title}</h3>
                            <p>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Industries */}
            <section className="section section-dark" id="industries-section">
                <div className="section-header">
                    <h2>Works Across <span className="gold-text">Industries</span></h2>
                    <p>From software engineering to skilled trades — verify any hands-on ability</p>
                </div>
                <div className="industries-grid">
                    {industries.map((ind, i) => (
                        <div className={`card industry-card`} key={i}>
                            <div className={`card-icon card-icon-${ind.color}`} style={{ margin: '0 auto 1rem' }}>
                                {ind.icon}
                            </div>
                            <h3>{ind.name}</h3>
                            <p>{ind.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats */}
            <section className="section" id="stats-section">
                <div className="stats-bar">
                    <div className="stat-item">
                        <div className="stat-number">4.7 Cr</div>
                        <div className="stat-label">ITI graduates with unverified skills</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">78%</div>
                        <div className="stat-label">Employers hire wrong due to fake resumes</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">∞</div>
                        <div className="stat-label">Potential when skills are truly proven</div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section section-dark" style={{ textAlign: 'center' }}>
                <div className="section-header">
                    <h2>Ready to <span className="gradient-text">Prove Your Skills</span>?</h2>
                    <p>Join thousands of candidates who've earned verified skill badges</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/register?role=candidate" className="btn btn-gold btn-lg">
                        Start Recording <Video size={20} />
                    </Link>
                    <Link to="/register?role=employer" className="btn btn-secondary btn-lg">
                        Hire Verified Talent <Users size={20} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer" id="footer">
                <p className="footer-tagline">"Your hands are your resume."</p>
                <p className="footer-credit">
                    SkillProof — AI-Powered Skill Verification | Built with React + Node.js + Gemini Vision API
                </p>
            </footer>
        </>
    );
}
