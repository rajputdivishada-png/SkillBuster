import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('skillproof_token');
        const savedUser = localStorage.getItem('skillproof_user');

        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem('skillproof_token');
                localStorage.removeItem('skillproof_user');
            }
        }
        setLoading(false);
    }, []);

    const loginUser = (userData, token) => {
        localStorage.setItem('skillproof_token', token);
        localStorage.setItem('skillproof_user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('skillproof_token');
        localStorage.removeItem('skillproof_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
