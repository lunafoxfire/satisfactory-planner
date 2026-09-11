import type { StateCreator } from "zustand";
import type { PlannerStore } from "./store";
import type { GameData } from "#data/game-data-schema";

import type { RecipeState } from "#data/shared-factory-schema";
export type { RecipeState };

export interface RecipeActions {
    initRecipes: (gameData: GameData) => void;
    setRecipeEnabled: (recipeId: string, enabled: boolean) => void;
    setAllRecipesEnabled: () => void;
    setStandardRecipesEnabled: (gameData: GameData) => void;
    setNoRecipesEnabled: () => void;
    setConversionsEnabled: (enabled: boolean) => void;
    setFicsmasEnabled: (enabled: boolean) => void;
}

export type RecipeSlice = RecipeState & RecipeActions;

export const createRecipeSlice: StateCreator<PlannerStore, [], [], RecipeSlice>
    = (set) => ({
        recipes: {
            enabled: {},
            conversionsEnabled: false,
            ficsmasEnabled: false,
        },

        initRecipes: (gameData) =>
            set((state) => {
                const enabledRecipes: Record<string, boolean> = {};
                Object.keys(gameData.recipes).forEach((recipeId) => {
                    if (recipeId in state.recipes.enabled) {
                        enabledRecipes[recipeId] = state.recipes.enabled[recipeId];
                    } else {
                        enabledRecipes[recipeId] = !gameData.recipes[recipeId].isAlternate;
                    }
                });
                return {
                    recipes: {
                        ...state.recipes,
                        enabled: enabledRecipes,
                    }
                };
            }),

        setRecipeEnabled: (recipeId, enabled) =>
            set((state) => ({
                recipes: {
                    ...state.recipes,
                    enabled: {
                        ...state.recipes.enabled,
                        [recipeId]: enabled,
                    },
                },
            })),

        setAllRecipesEnabled: () =>
            set((state) => {
                const enabledRecipes: Record<string, boolean> = {};
                Object.keys(state.recipes.enabled).forEach((recipeId) => {
                    enabledRecipes[recipeId] = true;
                });
                return {
                    recipes: {
                        ...state.recipes,
                        enabled: enabledRecipes,
                    }
                };
            }),

        setStandardRecipesEnabled: (gameData) =>
            set((state) => {
                const enabledRecipes: Record<string, boolean> = {};
                Object.keys(state.recipes.enabled).forEach((recipeId) => {
                    if (gameData.recipes[recipeId]?.isAlternate) {
                        enabledRecipes[recipeId] = false;
                    } else {
                        enabledRecipes[recipeId] = true;
                    }
                });
                return {
                    recipes: {
                        ...state.recipes,
                        enabled: enabledRecipes,
                    }
                };
            }),

        setNoRecipesEnabled: () =>
            set((state) => {
                const enabledRecipes: Record<string, boolean> = {};
                Object.keys(state.recipes.enabled).forEach((recipeId) => {
                    enabledRecipes[recipeId] = false;
                });
                return {
                    recipes: {
                        ...state.recipes,
                        enabled: enabledRecipes,
                    }
                };
            }),

        setConversionsEnabled: (enabled) =>
            set((state) => ({
                recipes: {
                    ...state.recipes,
                    conversionsEnabled: enabled,
                },
            })),

        setFicsmasEnabled: (enabled) =>
            set((state) => ({
                recipes: {
                    ...state.recipes,
                    ficsmasEnabled: enabled,
                },
            })),
    });
