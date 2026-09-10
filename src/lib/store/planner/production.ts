import type { StateCreator } from "zustand";
import type { PlannerStore } from "./store";
import type { SolverObjective } from "#lib/solver/problem";

export type ProductionTarget =
    | {
        id: string;
        itemId: string | null;
        mode: "itemsPerMinute";
        rate: number;
    }
    | {
        id: string;
        itemId: string | null;
        mode: "fromRecipe";
        recipeId: string | null;
        multiplier: number;
    }
    | {
        id: string;
        itemId: string | null;
        mode: "maximize";
        priority: number;
    };

export interface ProductionState {
    production: {
        targets: ProductionTarget[];
        objective: SolverObjective;
    };
}

export interface ProductionActions {
    addProductionTarget: () => void;
    removeProductionTarget: (id: string) => void;
    setProductionTargetItem: (id: string, itemId: string | null) => void;
    setProductionTargetMode: (id: string, mode: ProductionTarget["mode"], recipeId: string | null) => void;
    setProductionTargetRate: (id: string, rate: number) => void;
    setProductionTargetMultiplier: (id: string, multiplier: number) => void;
    setProductionTargetPriority: (id: string, priority: number) => void;

    setProductionObjective: (objective: SolverObjective) => void;
}

export type ProductionSlice = ProductionState & ProductionActions;

const defaultProductionTarget = (): ProductionTarget => ({
    id: crypto.randomUUID(),
    itemId: null,
    mode: "itemsPerMinute",
    rate: 10,
});

export const createProductionSlice: StateCreator<PlannerStore, [], [], ProductionSlice>
    = (set) => ({
        production: {
            targets: [],
            objective: "minimizeResourceUsage"
        },

        addProductionTarget: () =>
            set((state) => ({
                production: {
                    ...state.production,
                    targets: [
                        ...state.production.targets,
                        defaultProductionTarget(),
                    ],
                },
            })),

        removeProductionTarget: (id) =>
            set((state) => ({
                production: {
                    ...state.production,
                    targets: state.production.targets.filter(
                        (target) => target.id !== id,
                    ),
                },
            })),

        setProductionTargetItem: (id, itemId) =>
            set((state) => ({
                production: {
                    ...state.production,
                    targets: state.production.targets.map((target) =>
                        target.id === id ? { ...target, itemId, mode: "itemsPerMinute", rate: 10 } : target,
                    ),
                },
            })),

        setProductionTargetMode: (id, mode, recipeId) =>
            set((state) => ({
                production: {
                    ...state.production,
                    targets: state.production.targets.map((target) => {
                        if (target.id !== id) {
                            return target;
                        }

                        switch (mode) {
                            case "itemsPerMinute":
                                return {
                                    id: target.id,
                                    itemId: target.itemId,
                                    mode,
                                    rate: 10,
                                };

                            case "fromRecipe":
                                return {
                                    id: target.id,
                                    itemId: target.itemId,
                                    mode,
                                    recipeId: recipeId,
                                    multiplier: 1,
                                };

                            case "maximize":
                                return {
                                    id: target.id,
                                    itemId: target.itemId,
                                    mode,
                                    priority: 1,
                                };
                        }
                    }),
                },
            })),

        setProductionTargetRate: (id, rate) =>
            set((state) => ({
                production: {
                    ...state.production,
                    targets: state.production.targets.map((target) =>
                        target.id === id && target.mode === "itemsPerMinute"
                            ? { ...target, rate }
                            : target,
                    ),
                },
            })),

        setProductionTargetMultiplier: (id, multiplier) =>
            set((state) => ({
                production: {
                    ...state.production,
                    targets: state.production.targets.map((target) =>
                        target.id === id && target.mode === "fromRecipe"
                            ? { ...target, multiplier }
                            : target,
                    ),
                },
            })),

        setProductionTargetPriority: (id, priority) =>
            set((state) => ({
                production: {
                    ...state.production,
                    targets: state.production.targets.map((target) =>
                        target.id === id && target.mode === "maximize"
                            ? { ...target, priority }
                            : target,
                    ),
                },
            })),

        setProductionObjective: (objective) =>
            set((state) => ({
                production: {
                    ...state.production,
                    objective,
                },
            })),
    });
