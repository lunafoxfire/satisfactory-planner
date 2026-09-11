import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createProductionSlice, type ProductionActions } from "./production";
import { createInputSlice, type InputActions } from "./inputs";
import { createRecipeSlice, type RecipeActions } from "./recipes";

import type { PlannerState } from "#data/shared-factory-schema";
export type { PlannerState };
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
            partialize: (state) => ({
                production: state.production,
                input: state.input,
                recipes: state.recipes,
            }),
        },
    ),
);
