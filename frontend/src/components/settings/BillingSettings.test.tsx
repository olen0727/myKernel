import { render, screen } from '@testing-library/react'
import { BillingSettings } from './BillingSettings'
import { describe, it, expect } from 'vitest'

describe('BillingSettings', () => {
    it('renders billing card with current plan', () => {
        render(<BillingSettings />)
        expect(screen.getByText('Billing & Subscription')).toBeInTheDocument()
        expect(screen.getByText('Current Plan')).toBeInTheDocument()
        expect(screen.getAllByText('Free')).toHaveLength(2)
    })

    it('renders upgrade button', () => {
        render(<BillingSettings />)
        expect(screen.getByRole('button', { name: /upgrade to pro/i })).toBeInTheDocument()
    })

    it('shows payment method section', () => {
        render(<BillingSettings />)
        expect(screen.getByText('Payment Method')).toBeInTheDocument()
    })
})
