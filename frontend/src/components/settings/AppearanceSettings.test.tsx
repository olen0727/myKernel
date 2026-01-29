import { render, screen } from '@testing-library/react'
import { AppearanceSettings } from './AppearanceSettings'
import { describe, it, expect } from 'vitest'

describe('AppearanceSettings', () => {
    it('renders theme radio group with Kernel Dark and Kernel Light', () => {
        render(<AppearanceSettings />)
        expect(screen.getByRole('radiogroup', { name: /theme selection/i })).toBeInTheDocument()
        expect(screen.getByLabelText(/kernel dark/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/kernel light/i)).toBeInTheDocument()
    })

    it('has Kernel Dark selected by default', () => {
        render(<AppearanceSettings />)
        const darkRadio = screen.getByLabelText(/kernel dark/i) as HTMLInputElement
        expect(darkRadio.checked).toBe(true)
    })

    it('renders font family select with correct options', () => {
        render(<AppearanceSettings />)
        expect(screen.getByLabelText(/font family/i)).toBeInTheDocument()
    })
})
