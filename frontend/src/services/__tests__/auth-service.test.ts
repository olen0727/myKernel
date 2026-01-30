import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../auth-service';

// Mock global window location
const mockLocation = {
    href: '',
    assign: vi.fn(),
};

describe('AuthService', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        // @ts-ignore
        delete window.location;
        // @ts-ignore
        window.location = mockLocation;
        localStorage.clear();
    });

    it('should redirect to google auth endpoint', () => {
        AuthService.loginWithGoogle();
        expect(mockLocation.href).toContain('/auth/google');
    });

    it('should redirect to github auth endpoint', () => {
        AuthService.loginWithGitHub();
        expect(mockLocation.href).toContain('/auth/github');
    });

    it('should store token on handling callback', () => {
        const token = 'test-jwt-token';
        AuthService.handleCallback(token);
        expect(localStorage.getItem('kernel_auth_token')).toBe(token);
    });

    it('should retrieve user profile after auth', async () => {
        // Mock fetch for user profile
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ id: '1', name: 'Test User', email: 'test@example.com' }),
        });

        const user = await AuthService.getCurrentUser();
        expect(user).toEqual({ id: '1', name: 'Test User', email: 'test@example.com' });
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/v1/users/me'), expect.any(Object));
    });

    it('should clear token on logout', () => {
        localStorage.setItem('kernel_auth_token', 'token');
        AuthService.logout();
        expect(localStorage.getItem('kernel_auth_token')).toBeNull();
    });
});
