import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createProductionSlice, type ProductionActions, type ProductionState } from "./production";
import { createInputSlice, type InputActions, type InputState } from "./inputs";
import { createRecipeSlice, type RecipeActions, type RecipeState } from "./recipes";

export type PlannerState = ProductionState & InputState & RecipeState;
export type PlannerActions = ProductionActions & InputActions & RecipeActions;
export type PlannerStore = PlannerState & PlannerActions;

export const usePlannerStore = create<PlannerStore>()(
    persist(
        (...args) => ({
            ...createProductionSlice(...args),
            ...createInputSlice(...args),
            ...createRecipeSlice(...args),
        }),
        {
            name: "satisfactory-planner",
            version: 1,
        },
    ),
);
