import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AreaListPage from '../AreaListPage'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

// Mock the toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
    },
}))

describe('AreaListPage', () => {
    it('renders correctly with mock data', () => {
        render(
            <BrowserRouter>
                <AreaListPage />
            </BrowserRouter>
        )

        expect(screen.getByText('Areas 領域列表')).toBeInTheDocument()
        // Should render initial areas from mock data
        expect(screen.getByText('Work 職涯與專業')).toBeInTheDocument()
        expect(screen.getByText('新增新領域')).toBeInTheDocument()
    })

    it('opens create modal when clicking "新增新領域"', async () => {
        render(
            <BrowserRouter>
                <AreaListPage />
            </BrowserRouter>
        )

        await userEvent.click(screen.getByText('新增新領域'))
        expect(screen.getByText('建立新領域')).toBeInTheDocument()
    })
})
