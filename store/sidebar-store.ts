import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarStore {
  isOpen: boolean
  hasHydrated: boolean
  toggle: () => void
  open: () => void
  close: () => void
  setHasHydrated: (state: boolean) => void
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isOpen: true,
      hasHydrated: false,
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'froggy-sidebar-state',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
