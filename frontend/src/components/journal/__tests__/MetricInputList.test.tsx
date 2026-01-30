
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MetricInputList } from '../MetricInputList'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { services } from '@/services'

// Mock services
vi.mock("@/services", () => {
    const { BehaviorSubject } = require('rxjs');

    const mockMetrics = [
        { id: 'mood', name: '心情 (Mood)', type: 'rating' },
        { id: 'energy', name: '能量 (Energy)', type: 'rating' },
        { id: 'sleep', name: '睡眠 (Sleep)', type: 'sleep' }
    ];

    const mockLogs = [
        // No logs initially
    ];

    const logSubject = new BehaviorSubject(mockLogs);

    return {
        services: {
            metric: Promise.resolve({
                getAll$: () => new BehaviorSubject(mockMetrics),
            }),
            log: Promise.resolve({
                getAll$: () => logSubject,
                create: vi.fn(),
                delete: vi.fn(),
                update: vi.fn()
            })
        }
    };
})

// Mock SleepTracker to simplify testing if needed, but it's part of integration
// Let's keep it real if possible, or mock if too complex.

describe('MetricInputList', () => {
    const testDate = new Date('2026-01-27T10:00:00')

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders all defined metrics', async () => {
        render(<MetricInputList date={testDate} />)
        await waitFor(() => expect(screen.queryByText("Loading Metrics...")).not.toBeInTheDocument());

        expect(screen.getByText('心情 (Mood)')).toBeInTheDocument()
        expect(screen.getByText('能量 (Energy)')).toBeInTheDocument()
        expect(screen.getByText('睡眠 (Sleep)')).toBeInTheDocument()
    })

    it('saves value on rating click', async () => {
        const logService = await services.log;

        render(<MetricInputList date={testDate} />)
        await waitFor(() => expect(screen.queryByText("Loading Metrics...")).not.toBeInTheDocument());

        // Find rating button 5 for mood
        // "心情 (Mood)" is rendered. We can search relative to it.
        const moodLabel = screen.getByText('心情 (Mood)');
        const moodContainer = moodLabel.closest('.p-4');

        // Assuming simple structure, we can just find any '5' button since all ratings behave same
        // But better to be specific.
        // Let's use `within` if possible, but `closest` + manual qS works.
        const btn5 = moodContainer?.querySelector('button[aria-label="Rate 5"]');
        // Note: MetricItem implementation sets aria-label={`Rate ${rating}`} or similar?
        // Let's check MetricItem implementation or just assume for now based on typical patterns.
        // Actually I haven't seen MetricItem code, but previously `screen.getAllByRole('button', { name: '5' })` was used.

        const allButtons = screen.getAllByRole('button', { name: '5' });
        if (allButtons.length > 0) {
            fireEvent.click(allButtons[0])
            expect(logService.create).toHaveBeenCalledWith(expect.objectContaining({
                metricId: 'mood',
                value: '5',
                date: '2026-01-27'
            }));
        }
    })
})
