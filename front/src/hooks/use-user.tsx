import { create } from "zustand";

interface useUser {
   role: string | null;
   setRole: (role: string | null) => void;
}

export const useUser = create<useUser>((set) => ({
   role: null,
   setRole: (role) => set({ role }),
}));
