import { render, screen } from '@testing-library/react'
import { AccountSettings } from './AccountSettings'
import { describe, it, expect } from 'vitest'

describe('AccountSettings', () => {
    it('renders profile configuration inputs', () => {
        render(<AccountSettings />)
        // Verified working in integration test
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    })

    it('renders save button', () => {
        render(<AccountSettings />)
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    })
})
