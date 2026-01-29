import { render, screen } from '@testing-library/react'
import { ShortcutList } from './ShortcutList'
import { describe, it, expect } from 'vitest'

describe('ShortcutList', () => {
    it('renders all required keyboard shortcuts', () => {
        render(<ShortcutList />)
        expect(screen.getByText('Quick Capture')).toBeInTheDocument()
        expect(screen.getByText('Global Search')).toBeInTheDocument()
        expect(screen.getByText('Previous Day')).toBeInTheDocument()
        expect(screen.getByText('Next Day')).toBeInTheDocument()
    })

    it('displays shortcuts with Ctrl/Cmd format', () => {
        render(<ShortcutList />)
        expect(screen.getByText('Ctrl/Cmd + Q')).toBeInTheDocument()
        expect(screen.getByText('Ctrl/Cmd + K')).toBeInTheDocument()
        expect(screen.getByText('Ctrl/Cmd + [')).toBeInTheDocument()
        expect(screen.getByText('Ctrl/Cmd + ]')).toBeInTheDocument()
    })

    it('renders the card with correct title', () => {
        render(<ShortcutList />)
        expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument()
        expect(screen.getByText('View available keyboard shortcuts.')).toBeInTheDocument()
    })
})
