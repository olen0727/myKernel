
import { render, screen } from '@testing-library/react'
import { SleepTracker, calculateSleepStats } from '../SleepTracker'
import { describe, it, expect } from 'vitest'

describe('SleepTracker Component', () => {
    const today = new Date('2025-01-28T12:00:00')

    it('renders sleep tracker labels', () => {
        render(<SleepTracker date={today} />)
        expect(screen.getByText(/Sleep At/i)).toBeInTheDocument()
        expect(screen.getByText(/Wake Up At/i)).toBeInTheDocument()
    })

    it('renders time pickers', () => {
        render(<SleepTracker date={today} />)
        // Should find placeholders HH and MM (2 sets)
        const placeholders = screen.getAllByText('HH')
        expect(placeholders.length).toBeGreaterThanOrEqual(2)
    })
})

describe('calculateSleepStats Logic', () => {
    const today = new Date('2025-01-28T12:00:00')

    it('calculates duration for same day sleep (01:00 to 08:00)', () => {
        const { text, minutes } = calculateSleepStats('01:00', '08:00', today)
        expect(text).toBe('7 hrs 0 mins')
        expect(minutes).toBe(420)
    })

    it('calculates duration for cross day sleep (23:00 to 07:00)', () => {
        const { text, minutes } = calculateSleepStats('23:00', '07:00', today)
        expect(text).toBe('8 hrs 0 mins')
        expect(minutes).toBe(480)
    })

    it('calculates duration for partial hour (23:30 to 07:00)', () => {
        const { text, minutes } = calculateSleepStats('23:30', '07:00', today)
        expect(text).toBe('7 hrs 30 mins')
        expect(minutes).toBe(450)
    })

    it('handles missing inputs gracefully', () => {
        expect(calculateSleepStats('', '07:00', today)).toEqual({ text: null, minutes: undefined })
        expect(calculateSleepStats('23:00', '', today)).toEqual({ text: null, minutes: undefined })
    })

    it('treats sleep time > wake time as yesterday', () => {
        // Sleep 09:00, Wake 08:00 => Sleep was yesterday 09:00. Diff = 23h.
        const { text, minutes } = calculateSleepStats('09:00', '08:00', today)
        expect(minutes).toBe(23 * 60)
        expect(text).toBe('23 hrs 0 mins')
    })
})
