import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { AreaCard } from '../AreaCard'
import { Area } from '@/services/mock-data-service'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

const mockArea: Area = {
    id: '1',
    name: 'Test Area',
    status: 'active',
    projectCount: 3,
    habitCount: 5,
    coverImage: 'https://example.com/image.jpg'
}

describe('AreaCard', () => {
    it('renders area information correctly', () => {
        render(<AreaCard area={mockArea} />)

        expect(screen.getByText('Test Area')).toBeInTheDocument()
        expect(screen.getByText(/3 Projects/i)).toBeInTheDocument()
        expect(screen.getByText(/5 Habits/i)).toBeInTheDocument()
        expect(screen.getByText(/Active/i)).toBeInTheDocument()

        const img = screen.getByAltText('Test Area')
        expect(img).toHaveAttribute('src', 'https://example.com/image.jpg')
    })

    it('calls onClick when clicked', async () => {
        const onClick = vi.fn()
        render(<AreaCard area={mockArea} onClick={onClick} />)

        await userEvent.click(screen.getByText('Test Area'))
        expect(onClick).toHaveBeenCalledTimes(1)
    })
})
