import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, User, Briefcase } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

    return (
        <nav className="navbar" id="main-navbar">
            <Link to="/" className="navbar-brand">
                <div className="logo-icon">
                    <Shield size={20} />
                </div>
                SkillProof
            </Link>

            <div className="navbar-links">
                {!user ? (
                    <>
                        <Link to="/login" className={isActive('/login')}>Login</Link>
                        <Link to="/register" className="nav-btn nav-btn-primary">Get Started</Link>
                    </>
                ) : user.role === 'candidate' ? (
                    <>
                        <Link to="/dashboard" className={isActive('/dashboard')}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <User size={16} /> Dashboard
                            </span>
                        </Link>
                        <Link to="/record" className={isActive('/record')}>Record Task</Link>
                        <button onClick={handleLogout} className="nav-btn nav-btn-outline">
                            <LogOut size={16} /> Logout
                        </button>
                    </>
                ) : user.role === 'employer' ? (
                    <>
                        <Link to="/employer" className={isActive('/employer')}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Briefcase size={16} /> Dashboard
                            </span>
                        </Link>
                        <button onClick={handleLogout} className="nav-btn nav-btn-outline">
                            <LogOut size={16} /> Logout
                        </button>
                    </>
                ) : null}
            </div>
        </nav>
    );
}
