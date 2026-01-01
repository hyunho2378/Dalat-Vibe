import { createContext, useContext, useState, useEffect } from 'react';

// =============================================================================
// Auth Context
// =============================================================================

const AuthContext = createContext(null);

// =============================================================================
// Auth Provider Component
// =============================================================================

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('dalat_user');
        const storedToken = localStorage.getItem('dalat_token');
        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch (e) {
                localStorage.removeItem('dalat_user');
                localStorage.removeItem('dalat_token');
            }
        }
        setIsLoading(false);
    }, []);

    // Register function - creates new account
    const register = async (email, username, password) => {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('dalat_user', JSON.stringify(data.user));
        localStorage.setItem('dalat_token', data.token);
        return data.user;
    };

    // Login function - validates credentials
    const login = async (email, password) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('dalat_user', JSON.stringify(data.user));
        localStorage.setItem('dalat_token', data.token);
        return data.user;
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('dalat_user');
        localStorage.removeItem('dalat_token');
    };

    const value = {
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// =============================================================================
// Custom Hook
// =============================================================================

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
