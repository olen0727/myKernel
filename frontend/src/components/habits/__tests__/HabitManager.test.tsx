import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { HabitManager } from '../HabitManager'
import '@testing-library/jest-dom'
import { services } from '@/services'

// Mock services
vi.mock("@/services", () => {
    const { BehaviorSubject } = require('rxjs');
    const mockHabits = [
        { id: '1', name: '寫日記', areaId: '1', frequency: 'daily', status: 'active', currentStreak: 5, maxStreak: 10 }
    ];
    // This subject allows us to push updates
    const habitSubject = new BehaviorSubject(mockHabits);

    return {
        services: {
            habit: Promise.resolve({
                getAll$: () => habitSubject,
                update: vi.fn(),
                create: vi.fn(),
                delete: vi.fn()
            }),
        }
    };
})

// Mock toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        info: vi.fn(),
        error: vi.fn(),
    },
}))

describe('HabitManager', () => {
    it('renders habits for the given area', async () => {
        render(<HabitManager areaId="1" />)

        await waitFor(() => expect(screen.queryByText("Loading Habits...")).not.toBeInTheDocument());

        expect(screen.getByText('習慣管理')).toBeInTheDocument()
        expect(screen.getByText('寫日記')).toBeInTheDocument()
    })

    it('can toggle habit status', async () => {
        const habitService = await services.habit;

        render(<HabitManager areaId="1" />)
        await waitFor(() => expect(screen.queryByText("Loading Habits...")).not.toBeInTheDocument());

        expect(screen.getByText('進行中')).toBeInTheDocument()

        const switchElement = screen.getByRole('switch')
        fireEvent.click(switchElement)

        expect(habitService.update).toHaveBeenCalledWith('1', { status: 'paused' });
    })

    it('can open the create modal', async () => {
        render(<HabitManager areaId="1" />)
        await waitFor(() => expect(screen.queryByText("Loading Habits...")).not.toBeInTheDocument());

        fireEvent.click(screen.getByText('新增習慣'))
        expect(screen.getByText('建立新習慣')).toBeInTheDocument()
    })
})
