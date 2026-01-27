import { render, screen, fireEvent } from '@testing-library/react'
import { MetricInputList } from '../MetricInputList'
import { dataStore } from '@/services/mock-data-service'
import { describe, it, expect } from 'vitest'

describe('MetricInputList', () => {
    const testDate = new Date('2026-01-27T10:00:00')

    it('renders all defined metrics', () => {
        render(<MetricInputList date={testDate} />)
        expect(screen.getByText('心情 (Mood)')).toBeInTheDocument()
        expect(screen.getByText('能量 (Energy)')).toBeInTheDocument()
        expect(screen.getByText('睡眠 (Sleep)')).toBeInTheDocument()
    })

    it('saves value on rating click', async () => {
        render(<MetricInputList date={testDate} />)
        // Find Mood section and click on rating 5
        // Since we iterate, we need to be specific.
        // Assuming visual order or use test id.
        // BUT labels are rendered.

        // Find the mood rating button '5'
        // Using "Mood" label container... tricky with simple queries. 
        // Let's just find the button 5 within the component.
        // As there are multiple rating components, getAllByText('5') would return multiple.

        // Let's add data-testid to MetricItem?
        // Or just check if mocking updates.

        // Clicking "5" on any rating should trigger update.
        // Let's pick the first one (Mood).

        const ratingButtons = screen.getAllByRole('button', { name: '5' })
        fireEvent.click(ratingButtons[0])

        // Verify dataStore has validation
        // Mock dataStore is synchronous.
        const dateStr = '2026-01-27'
        const entries = dataStore.getMetricEntries(dateStr)
        const moodEntry = entries.find(e => e.metricId === 'mood')

        expect(moodEntry).toBeDefined()
        expect(moodEntry?.value).toBe(5)
    })
})
