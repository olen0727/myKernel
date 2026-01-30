import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AreaListPage from '../AreaListPage'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

// Mock services
vi.mock("@/services", () => {
    const { BehaviorSubject } = require('rxjs');
    const mockAreas = [
        { id: '1', name: 'Work 職涯與專業', coverImage: '', description: '' },
    ];
    const mockAreaService = {
        getAll$: () => new BehaviorSubject(mockAreas),
        create: vi.fn(),
    };
    return {
        services: {
            area: Promise.resolve(mockAreaService),
            project: Promise.resolve({ getAll$: () => new BehaviorSubject([]) }),
            habit: Promise.resolve({ getAll$: () => new BehaviorSubject([]) }),
        }
    };
})

vi.mock('sonner', () => ({
    toast: { success: vi.fn(), error: vi.fn() },
}))

describe('AreaListPage', () => {
    it('renders correctly with mock data', async () => {
        render(
            <BrowserRouter>
                <AreaListPage />
            </BrowserRouter>
        )
        await waitFor(() => expect(screen.queryByText("Loading Areas...")).not.toBeInTheDocument());

        expect(screen.getByText('Areas 領域列表')).toBeInTheDocument()
        expect(screen.getByText('Work 職涯與專業')).toBeInTheDocument()
        expect(screen.getByText('新增新領域')).toBeInTheDocument()
    })

    it('opens create modal when clicking "新增新領域"', async () => {
        render(
            <BrowserRouter>
                <AreaListPage />
            </BrowserRouter>
        )
        await waitFor(() => expect(screen.queryByText("Loading Areas...")).not.toBeInTheDocument());

        await userEvent.click(screen.getByText('新增新領域'))
        expect(screen.getByText('建立新領域')).toBeInTheDocument()
    })
})
