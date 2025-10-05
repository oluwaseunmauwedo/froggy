import { create } from 'zustand'

interface AuthDialogStore {
  signInOpen: boolean
  signUpOpen: boolean
  openSignIn: () => void
  closeSignIn: () => void
  openSignUp: () => void
  closeSignUp: () => void
}

export const useAuthDialogStore = create<AuthDialogStore>((set) => ({
  signInOpen: false,
  signUpOpen: false,
  openSignIn: () => set({ signInOpen: true }),
  closeSignIn: () => set({ signInOpen: false }),
  openSignUp: () => set({ signUpOpen: true }),
  closeSignUp: () => set({ signUpOpen: false }),
}))
