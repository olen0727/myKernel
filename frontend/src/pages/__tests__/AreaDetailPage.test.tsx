import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AreaDetailPage from '../AreaDetailPage'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import '@testing-library/jest-dom'

describe('AreaDetailPage', () => {
    it('renders area details accurately', () => {
        render(
            <MemoryRouter initialEntries={['/areas/1']}>
                <Routes>
                    <Route path="/areas/:id" element={<AreaDetailPage />} />
                </Routes>
            </MemoryRouter>
        )

        // Check for title (from INITIAL_AREAS first item)
        expect(screen.getByText('Work 職涯與專業')).toBeInTheDocument()

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
