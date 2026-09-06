import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createProductionSlice, type ProductionActions, type ProductionState } from "./production";
// import { createInputsSlice } from "./inputs";
// import { createRecipesSlice } from "./recipes";

export type PlannerState = ProductionState;
export type PlannerActions = ProductionActions;
export type PlannerStore = PlannerState & PlannerActions;

export const usePlannerStore = create<PlannerStore>()(
    persist(
        (...args) => ({
            ...createProductionSlice(...args),
            // ...createInputsSlice(...args),
            // ...createRecipesSlice(...args),
        }),
        {
            name: "satisfactory-planner",
            version: 1,
        },
    ),
);
