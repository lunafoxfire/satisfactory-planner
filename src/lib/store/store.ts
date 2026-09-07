import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createProductionSlice, type ProductionSlice } from "./production";
import { createInputSlice, type InputSlice } from "./inputs";
import { createRecipeSlice, type RecipeSlice } from "./recipes";

export type PlannerStore = ProductionSlice & InputSlice & RecipeSlice;

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
