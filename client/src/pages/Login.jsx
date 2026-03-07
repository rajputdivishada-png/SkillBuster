import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginAPI } from '../api';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await loginAPI({ email, password });
            loginUser(data.user, data.token);
            toast.success(`Welcome back, ${data.user.name}!`);
            navigate(data.user.role === 'employer' ? '/employer' : '/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container" id="login-page">
            <div className="form-card">
                <h1>Welcome Back</h1>
                <p className="form-subtitle">Login to your SkillProof account</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            type="email"
                            className="form-input"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '0.5rem' }}
                        disabled={loading}
                        id="login-submit"
                    >
                        {loading ? (
                            <>
                                <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div>
                                Logging in...
                            </>
                        ) : (
                            <>
                                <LogIn size={18} /> Login
                            </>
                        )}
                    </button>
                </form>

                <p className="form-link">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>

                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(99,102,241,0.05)', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.1)' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Demo Accounts:</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Employer: hr@techcorp.com / password123<br />
                        Candidate: aarav@example.com / password123
                    </p>
                </div>
            </div>
        </div>
    );
}
