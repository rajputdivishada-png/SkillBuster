import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as registerAPI } from '../api';
import toast from 'react-hot-toast';
import { UserPlus, User, Briefcase } from 'lucide-react';

export default function Register() {
    const [searchParams] = useSearchParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(searchParams.get('role') || 'candidate');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await registerAPI({ name, email, password, role });
            loginUser(data.user, data.token);
            toast.success('Account created successfully!');
            navigate(role === 'employer' ? '/employer' : '/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container" id="register-page">
            <div className="form-card">
                <h1>Join SkillProof</h1>
                <p className="form-subtitle">Create your account and start proving your skills</p>

                <div className="role-selector">
                    <div
                        className={`role-option ${role === 'candidate' ? 'selected' : ''}`}
                        onClick={() => setRole('candidate')}
                        id="role-candidate"
                    >
                        <User size={20} style={{ marginBottom: '4px' }} />
                        <div>Candidate</div>
                    </div>
                    <div
                        className={`role-option ${role === 'employer' ? 'selected' : ''}`}
                        onClick={() => setRole('employer')}
                        id="role-employer"
                    >
                        <Briefcase size={20} style={{ marginBottom: '4px' }} />
                        <div>Employer</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="register-name">Full Name</label>
                        <input
                            id="register-name"
                            type="text"
                            className="form-input"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-email">Email</label>
                        <input
                            id="register-email"
                            type="email"
                            className="form-input"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-password">Password</label>
                        <input
                            id="register-password"
                            type="password"
                            className="form-input"
                            placeholder="Min 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '0.5rem' }}
                        disabled={loading}
                        id="register-submit"
                    >
                        {loading ? (
                            <>
                                <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div>
                                Creating account...
                            </>
                        ) : (
                            <>
                                <UserPlus size={18} /> Create Account
                            </>
                        )}
                    </button>
                </form>

                <p className="form-link">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
}
