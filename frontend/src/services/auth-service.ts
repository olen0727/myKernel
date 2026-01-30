import { User } from '../types/models';

const AUTH_TOKEN_KEY = 'kernel_auth_token';

// @ts-ignore
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const AuthService = {
    loginWithGoogle: () => {
        window.location.href = `${API_URL}/auth/google`;
    },

    loginWithGitHub: () => {
        window.location.href = `${API_URL}/auth/github`;
    },

    handleCallback: (token: string) => {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    },

    getCurrentUser: async (): Promise<User | null> => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (!token) return null;

        try {
            const response = await fetch(`${API_URL}/api/v1/users/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    AuthService.logout();
                }
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to fetch user:', error);
            return null;
        }
    },

    logout: () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
    },

    getToken: (): string | null => {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    }
};
