import type { StateCreator } from "zustand";
import type { PlannerStore } from "./store";
import type { GameData } from "#data/game-data-schema";

import type { InputItem } from "#data/shared-factory-schema";
export type { InputItem };

import type { InputResource } from "#data/shared-factory-schema";
export type { InputResource };

import type { InputState } from "#data/shared-factory-schema";
export type { InputState };

export interface InputActions {
    addInputItem: () => void;
    removeInputItem: (id: string) => void;
    setInputItem: (id: string, itemId: string | null) => void;
    setInputItemRate: (id: string, rate: number) => void;
    setInputItemUnlimited: (id: string, unlimited: boolean) => void;

    initInputResources: (gameData: GameData) => void;
    setInputResourceRate: (itemId: string, rate: number) => void;
    setInputResourceUnlimited: (itemId: string, unlimited: boolean) => void;

    setAllowHandGathered: (allowHandGathered: boolean) => void;
}

export type InputSlice = InputState & InputActions;

const defaultInputItem = (): InputItem => ({
    id: crypto.randomUUID(),
    itemId: null,
    rate: 10,
    unlimited: false,
});

export const createInputSlice: StateCreator<PlannerStore, [], [], InputSlice>
    = (set) => ({
        input: {
            items: [],
            resources: [],
            allowHandGathered: false,
        },

        addInputItem: () =>
            set((state) => ({
                input: {
                    ...state.input,
                    items: [
                        ...state.input.items,
                        defaultInputItem(),
                    ],
                },
            })),

        removeInputItem: (id) =>
            set((state) => ({
                input: {
                    ...state.input,
                    items: state.input.items.filter(
                        (item) => item.id !== id,
                    ),
                },
            })),

        setInputItem: (id, itemId) =>
            set((state) => ({
                input: {
                    ...state.input,
                    items: state.input.items.map((item) =>
                        item.id === id ? { ...item, itemId } : item,
                    ),
                },
            })),

        setInputItemRate: (id, rate) =>
            set((state) => ({
                input: {
                    ...state.input,
                    items: state.input.items.map((item) =>
                        item.id === id ? { ...item, rate } : item,
                    ),
                },
            })),

        setInputItemUnlimited: (id, unlimited) =>
            set((state) => ({
                input: {
                    ...state.input,
                    items: state.input.items.map((item) =>
                        item.id === id ? { ...item, unlimited } : item,
                    ),
                },
            })),

        initInputResources: (gameData) =>
            set((state) => {
                const resources: InputResource[] = [];

                Object.entries(gameData.resources).forEach(([itemId, { maxExtraction }]) => {
                    const existingEntry = state.input.resources.find((r) => r.itemId == itemId);
                    if (existingEntry) {
                        resources.push(existingEntry);
                    }
                    else {
                        resources.push({
                            itemId,
                            rate: maxExtraction,
                            unlimited: maxExtraction === 0,
                        });
                    }
                });

                return {
                    input: {
                        ...state.input,
                        resources,
                    }
                };
            }),

        setInputResourceRate: (itemId, rate) =>
            set((state) => ({
                input: {
                    ...state.input,
                    resources: state.input.resources.map((resource) =>
                        resource.itemId === itemId
                            ? { ...resource, rate }
                            : resource,
                    ),
                },
            })),

        setInputResourceUnlimited: (itemId, unlimited) =>
            set((state) => ({
                input: {
                    ...state.input,
                    resources: state.input.resources.map((resource) =>
                        resource.itemId === itemId
                            ? { ...resource, unlimited }
                            : resource,
                    ),
                },
            })),

        setAllowHandGathered: (allowHandGathered) =>
            set((state) => ({
                input: {
                    ...state.input,
                    allowHandGathered,
                },
            })),
    });
