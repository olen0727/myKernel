import { render, screen, waitFor } from '@testing-library/react'
import SettingsPage from './SettingsPage'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeAll } from 'vitest'
import userEvent from '@testing-library/user-event'

describe('SettingsPage', () => {

    // Polyfill ResizeObserver if needed by Radix/Shadcn
    beforeAll(() => {
        global.ResizeObserver = class ResizeObserver {
            observe() { }
            unobserve() { }
            disconnect() { }
        };
    });

    it('renders all four tabs', () => {
        render(<SettingsPage />, { wrapper: MemoryRouter })
        expect(screen.getByRole('tab', { name: /general & account/i })).toBeInTheDocument()
        expect(screen.getByRole('tab', { name: /appearance/i })).toBeInTheDocument()
        expect(screen.getByRole('tab', { name: /keyboard shortcuts/i })).toBeInTheDocument()
        expect(screen.getByRole('tab', { name: /billing & subscription/i })).toBeInTheDocument()
    })

    it('renders and switches tabs correctly', async () => {
        const user = userEvent.setup()
        render(<SettingsPage />, { wrapper: MemoryRouter })

        // Check General & Account Tab (Default)
        const generalTab = screen.getByRole('tab', { name: /general & account/i })
        expect(generalTab).toHaveAttribute('data-state', 'active')
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument()

        // Switch to Appearance
        const appearanceTab = screen.getByRole('tab', { name: /appearance/i })
        await user.click(appearanceTab)

        await waitFor(() => {
            expect(appearanceTab).toHaveAttribute('data-state', 'active')
        })
        expect(screen.getByText(/kernel dark/i)).toBeInTheDocument()

        // Switch to Keyboard Shortcuts
        const shortcutsTab = screen.getByRole('tab', { name: /keyboard shortcuts/i })
        await user.click(shortcutsTab)

        await waitFor(() => {
            expect(shortcutsTab).toHaveAttribute('data-state', 'active')
        })
        expect(screen.getByText(/quick capture/i)).toBeInTheDocument()

        // Switch to Billing & Subscription
        const billingTab = screen.getByRole('tab', { name: /billing & subscription/i })
        await user.click(billingTab)

        await waitFor(() => {
            expect(billingTab).toHaveAttribute('data-state', 'active')
        })
        expect(screen.getByText(/current plan/i)).toBeInTheDocument()
    })
})
