import { create } from "zustand";
import type { SolveResult } from "#lib/solver/solver";

export interface SolverState {
    result: SolveResult;
}

export interface SolverActions {
    setResult: (result: SolveResult) => void;
}

export type SolverStore = SolverState & SolverActions;

export const useSolverStore = create<SolverStore>((set) => ({
    result: {
        status: "empty"
    },

    setResult: (result) => set({ result }),
}));
