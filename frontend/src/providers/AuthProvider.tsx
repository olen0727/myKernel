import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/models';
import { AuthService } from '../services/auth-service';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    loginWithGoogle: () => void;
    loginWithGitHub: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                // Check if we have a token from URL (OAuth Callback)
                // [SECURITY FIX] Parse from Hash instead of Search to avoid leakage
                const hash = window.location.hash;
                let tokenFromUrl = null;

                if (hash.includes('token=')) {
                    // More robust parsing that handles potential padding (=) or multiple params
                    const match = hash.match(/token=([^&]+)/);
                    tokenFromUrl = match ? match[1] : null;
                }

                if (tokenFromUrl) {
                    AuthService.handleCallback(tokenFromUrl);
                    // Clear the token from URL without refreshing, but after a tiny delay
                    // to ensure no race conditions with other mounting effects
                    setTimeout(() => {
                        window.history.replaceState({}, document.title, window.location.pathname);
                    }, 100);
                }

                const currentUser = await AuthService.getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Auth initialization failed', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const loginWithGoogle = () => AuthService.loginWithGoogle();
    const loginWithGitHub = () => AuthService.loginWithGitHub();
    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, loginWithGoogle, loginWithGitHub, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
