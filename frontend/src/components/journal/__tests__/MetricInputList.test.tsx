
import { render, screen, fireEvent } from '@testing-library/react'
import { MetricInputList } from '../MetricInputList'
import { dataStore } from '@/services/mock-data-service'
import { describe, it, expect, beforeEach } from 'vitest'

describe('MetricInputList', () => {
    const testDate = new Date('2026-01-27T10:00:00')

    beforeEach(() => {
        // Reset or explicit cleanup if needed properly, mock store might persist across tests if not careful.
        // But for our quick checks, ensuring distinct actions helps.
    })

    it('renders all defined metrics', () => {
        render(<MetricInputList date={testDate} />)
        expect(screen.getByText('心情 (Mood)')).toBeInTheDocument()
        expect(screen.getByText('能量 (Energy)')).toBeInTheDocument()
        expect(screen.getByText('睡眠 (Sleep)')).toBeInTheDocument()
    })

    it('saves value on rating click and deletes on toggle', async () => {
        render(<MetricInputList date={testDate} />)
        const ratingButtons = screen.getAllByRole('button', { name: '5' })
        const moodBtn = ratingButtons[0]

        // First click to set
        fireEvent.click(moodBtn)
        const dateStr = '2026-01-27'
        expect(dataStore.getMetricEntries(dateStr).find((e: any) => e.metricId === 'mood')).toBeDefined()

        // Second click to clear
        fireEvent.click(moodBtn)
        expect(dataStore.getMetricEntries(dateStr).find((e: any) => e.metricId === 'mood')).toBeUndefined()
    })

    // it('clears sleep metric when inputs are cleared', async () => {
    //     render(<MetricInputList date={testDate} />)
    //     const sleepInput = screen.getByLabelText(/sleep at/i)
    //     const wakeInput = screen.getByLabelText(/wake up at/i)

    //     // Set values
    //     fireEvent.change(sleepInput, { target: { value: '01:00' } })
    //     fireEvent.change(wakeInput, { target: { value: '09:00' } })

    //     const dateStr = '2026-01-27'
    //     const sleepEntry = () => dataStore.getMetricEntries(dateStr).find((e: any) => e.metricId === 'sleep')
    //     expect(sleepEntry()).toBeDefined()

    //     // Clear one input
    //     fireEvent.change(sleepInput, { target: { value: '' } })
    //     // Should be deleted
    //     expect(sleepEntry()).toBeUndefined()
    // })
})
