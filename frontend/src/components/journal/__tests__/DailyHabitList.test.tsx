import { render, screen } from '@testing-library/react'
import { DailyHabitList } from '../DailyHabitList'
import { dataStore, Habit } from '@/services/mock-data-service'
import { describe, it, expect, beforeEach } from 'vitest'

describe('DailyHabitList', () => {
    const testDate = new Date('2026-01-27T10:00:00') // Tuesday

    beforeEach(() => {
        // Clear habits and set up test data
        // Since dataStore is a singleton, we might need a way to clear or mock it.
        // Assuming we can just manipulate it via public methods or it's just a variable.
        // But dataStore properties are private.
        // We can inspect behaviors or just add unique test habits.
    })

    it('renders daily habits', () => {
        const habitId = 'test-daily-habit'
        const habit: Habit = {
            id: habitId,
            name: 'Test Daily Habit',
            currentStreak: 0,
            maxStreak: 0,
            status: 'active',
            frequency: 'daily',
            areaId: 'area-1',
            completedDates: []
        }
        dataStore.addHabit(habit)

        render(<DailyHabitList date={testDate} />)
        expect(screen.getByText('Test Daily Habit')).toBeInTheDocument()
    })

    it('renders weekly habits only on scheduled days', () => {
        const tuesdayHabit: Habit = {
            id: 'test-tues-habit',
            name: 'Test Tuesday Habit',
            currentStreak: 0,
            maxStreak: 0,
            status: 'active',
            frequency: 'weekly',
            days: [2], // Tuesday
            areaId: 'area-1',
            completedDates: []
        }
        const mondayHabit: Habit = {
            id: 'test-mon-habit',
            name: 'Test Monday Habit',
            currentStreak: 0,
            maxStreak: 0,
            status: 'active',
            frequency: 'weekly',
            days: [1], // Monday
            areaId: 'area-1',
            completedDates: []
        }

        dataStore.addHabit(tuesdayHabit)
        dataStore.addHabit(mondayHabit)

        render(<DailyHabitList date={testDate} />) // Tuesday

        expect(screen.getByText('Test Tuesday Habit')).toBeInTheDocument()
        expect(screen.queryByText('Test Monday Habit')).not.toBeInTheDocument()
    })
})
