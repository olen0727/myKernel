import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface QuickCaptureState {
    isOpen: boolean
    content: string
    onOpen: () => void
    onClose: () => void
    toggle: () => void
    setContent: (content: string) => void
}

export const useQuickCapture = create<QuickCaptureState>()(
    persist(
        (set) => ({
            isOpen: false,
            content: "",
            onOpen: () => set({ isOpen: true }),
            onClose: () => set({ isOpen: false }),
            toggle: () => set((state) => ({ isOpen: !state.isOpen })),
            setContent: (content: string) => set({ content }),
        }),
        {
            name: 'quick-capture-storage',
        }
    )
)
