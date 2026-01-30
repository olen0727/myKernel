import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AreaDetailPage from '../AreaDetailPage'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import '@testing-library/jest-dom'

// Mock services
vi.mock("@/services", () => {
    const { BehaviorSubject } = require('rxjs');
    const mockArea = { id: '1', name: 'Work 職涯與專業', coverImage: '', description: 'Desc', status: 'active' };
    const mockProjects = [
        { id: 'p1', name: 'P1', areaId: '1', status: 'active' },
        { id: 'p2', name: 'P2', areaId: '1', status: 'active' },
        { id: 'p3', name: 'P3', areaId: '1', status: 'active' },
    ];
    const mockHabits = [
        { id: 'h1', title: 'H1', areaId: '1' },
        { id: 'h2', title: 'H2', areaId: '1' },
    ];

    return {
        services: {
            area: Promise.resolve({
                getById$: () => new BehaviorSubject(mockArea),
                update: vi.fn(),
                delete: vi.fn()
            }),
            project: Promise.resolve({ getAll$: () => new BehaviorSubject(mockProjects), create: vi.fn() }),
            habit: Promise.resolve({ getAll$: () => new BehaviorSubject(mockHabits) }),
            resource: Promise.resolve({ getAll$: () => new BehaviorSubject([]) }),
            task: Promise.resolve({ getAll$: () => new BehaviorSubject([]) }),
        }
    };
})

vi.mock('sonner', () => ({
    toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock("@/components/habits/HabitManager", () => ({
    HabitManager: () => <div>HabitManager Mock</div>
}))

describe('AreaDetailPage', () => {
    it('renders area details accurately', async () => {
        render(
            <MemoryRouter initialEntries={['/areas/1']}>
                <Routes>
                    <Route path="/areas/:id" element={<AreaDetailPage />} />
                </Routes>
            </MemoryRouter>
        )

        // Wait for loading to finish and title to appear
        // If this times out, check if "找不到此領域" is displayed or "Loader"
        await waitFor(() => expect(screen.getByText('Work 職涯與專業')).toBeInTheDocument(), { timeout: 3000 });

        // Check for stats
        expect(screen.getByText(/3 進行中專案/i)).toBeInTheDocument()
        expect(screen.getByText(/2 核心習慣/i)).toBeInTheDocument()

        // Check for tabs
        expect(screen.getByText('進行中專案')).toBeInTheDocument()
        expect(screen.getByText('習慣管理')).toBeInTheDocument()

        // Check for sidebar info
        expect(screen.getByText('領域資訊')).toBeInTheDocument()
    })
})
