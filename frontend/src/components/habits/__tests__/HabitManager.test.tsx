import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { HabitManager } from '../HabitManager'
import { HABITS } from '@/services/mock-data-service'
import '@testing-library/jest-dom'

// Mock toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        info: vi.fn(),
    },
}))

describe('HabitManager', () => {
    it('renders habits for the given area', () => {
        // Current INITIAL_AREAS first area has areaId "1"
        render(<HabitManager areaId="1" />)

        expect(screen.getByText('習慣管理')).toBeInTheDocument()
        // "寫日記" has areaId "1"
        expect(screen.getByText('寫日記')).toBeInTheDocument()
    })

    it('can toggle habit status', async () => {
        render(<HabitManager areaId="1" />)

        const switchElement = screen.getByRole('switch')
        expect(screen.getByText('進行中')).toBeInTheDocument()

        fireEvent.click(switchElement)
        expect(screen.getByText('已暫停')).toBeInTheDocument()
    })

    it('can open the create modal', () => {
        render(<HabitManager areaId="1" />)

        fireEvent.click(screen.getByText('新增習慣'))
        expect(screen.getByText('建立新習慣')).toBeInTheDocument()
    })
})
