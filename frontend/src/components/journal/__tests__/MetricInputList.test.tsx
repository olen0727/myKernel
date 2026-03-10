
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MetricInputList } from '../MetricInputList'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { services } from '@/services'

// Mock services
vi.mock("@/services", () => {
    const { BehaviorSubject } = require('rxjs');

    const mockMetrics = [
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

        expect(screen.getByText('能量 (Energy)')).toBeInTheDocument()
        expect(screen.getByText('睡眠 (Sleep)')).toBeInTheDocument()
    })

    it('saves value on rating click', async () => {
        const logService = await services.log;

        render(<MetricInputList date={testDate} />)
        await waitFor(() => expect(screen.queryByText("Loading Metrics...")).not.toBeInTheDocument());

        // Find rating button 5 for energy
        const energyLabel = screen.getByText('能量 (Energy)');
        const energyContainer = energyLabel.closest('.p-4');

        const allButtons = screen.getAllByRole('button', { name: '5' });
        if (allButtons.length > 0) {
            fireEvent.click(allButtons[0])
            expect(logService.create).toHaveBeenCalledWith(expect.objectContaining({
                metricId: 'energy',
                value: '5',
                date: '2026-01-27'
            }));
        }
    })
})
