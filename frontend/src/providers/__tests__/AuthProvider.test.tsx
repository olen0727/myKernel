import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthProvider';
import { AuthService } from '../../services/auth-service';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../../services/auth-service');

const TestComponent = () => {
    const { user, isLoading } = useAuth();
    if (isLoading) return <div>Loading...</div>;
    return <div>{user ? `User: ${user.name}` : 'No User'}</div>;
};

describe('AuthProvider', () => {
    it('should load user on mount', async () => {
        const mockUser = { id: '1', name: 'Test User', email: 'test@test.com', type: 'user' };
        // @ts-ignore
        vi.mocked(AuthService.getCurrentUser).mockResolvedValue(mockUser);

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
        await waitFor(() => expect(screen.getByText('User: Test User')).toBeInTheDocument());
    });

    it('should handle no user', async () => {
        // @ts-ignore
        vi.mocked(AuthService.getCurrentUser).mockResolvedValue(null);

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => expect(screen.getByText('No User')).toBeInTheDocument());
    });
});
