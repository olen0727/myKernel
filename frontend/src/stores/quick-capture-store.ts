import { create } from 'zustand'

interface QuickCaptureState {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
    toggle: () => void
}

export const useQuickCapture = create<QuickCaptureState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))
