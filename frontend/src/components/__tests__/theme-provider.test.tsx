import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../theme-provider';
import React from 'react';

// 模擬 matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // 跳過警告
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

describe('ThemeProvider', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.classList.remove('dark', 'light');
    });

    it('應使用預設主題 (system)', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ThemeProvider>{children}</ThemeProvider>
        );
        const { result } = renderHook(() => useTheme(), { wrapper });

        expect(result.current.theme).toBe('system');
    });

    it('切換主題應更新 localStorage 與 document class', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ThemeProvider>{children}</ThemeProvider>
        );
        const { result } = renderHook(() => useTheme(), { wrapper });

        act(() => {
            result.current.setTheme('dark');
        });

        expect(result.current.theme).toBe('dark');
        expect(localStorage.getItem('vite-ui-theme')).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
});
