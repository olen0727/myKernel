
import { render, screen, waitFor } from '@testing-library/react'
import { DailyHabitList } from '../DailyHabitList'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock services
vi.mock("@/services", () => {
    const { BehaviorSubject } = require('rxjs');
    const mockHabits = [
        { id: '1', name: 'Test Daily Habit', areaId: 'area-1', frequency: 'daily', status: 'active', currentStreak: 0, maxStreak: 0, completedDates: [], days: [] },
        { id: '2', name: 'Test Weekly Habit', areaId: 'area-1', frequency: 'weekly', status: 'active', currentStreak: 0, maxStreak: 0, completedDates: [], days: [1] } // Monday
    ];

    return {
        services: {
            habit: Promise.resolve({
                getAll$: () => new BehaviorSubject(mockHabits),
                update: vi.fn(),
            }),
        }
    };
})

vi.mock('sonner', () => ({
    toast: { success: vi.fn(), error: vi.fn() },
}))


describe('DailyHabitList', () => {
    const testDate = new Date('2026-01-27T10:00:00') // Tuesday (Day 2)

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders daily habits', async () => {
        render(<DailyHabitList date={testDate} />)
        await waitFor(() => expect(screen.queryByText("Loading Habits...")).not.toBeInTheDocument());

        expect(screen.getByText('Test Daily Habit')).toBeInTheDocument()
    })

    it('renders weekly habits only on scheduled days', async () => {
        // Monday is day 1. Tuesday is day 2.
        // Habit 2 is scheduled for Monday (1).
        // Test date is Tuesday -> Should NOT show Habit 2?
        // Wait, 
        // 0=Sun, 1=Mon, 2=Tue...
        // Habit 2 days=[1] (Mon).
        // Test date is Tuesday (2).
        // So shouldn't show.

        render(<DailyHabitList date={testDate} />)
        await waitFor(() => expect(screen.queryByText("Loading Habits...")).not.toBeInTheDocument());

        expect(screen.getByText('Test Daily Habit')).toBeInTheDocument()
        expect(screen.queryByText('Test Weekly Habit')).not.toBeInTheDocument()

        // Render on Monday
        const mondayDate = new Date('2026-01-26T10:00:00'); // Monday
        render(<DailyHabitList date={mondayDate} />)
        await waitFor(() => expect(screen.queryByText("Loading Habits...")).not.toBeInTheDocument());

        expect(screen.getByText('Test Weekly Habit')).toBeInTheDocument();
    })
})
