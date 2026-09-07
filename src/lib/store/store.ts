import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createProductionSlice, type ProductionSlice } from "./production";
import { createInputSlice, type InputSlice } from "./inputs";
// import { createRecipesSlice } from "./recipes";

export type PlannerStore = ProductionSlice & InputSlice;

export const usePlannerStore = create<PlannerStore>()(
    persist(
        (...args) => ({
            ...createProductionSlice(...args),
            ...createInputSlice(...args),
            // ...createRecipesSlice(...args),
        }),
        {
            name: "satisfactory-planner",
            version: 1,
        },
    ),
);
