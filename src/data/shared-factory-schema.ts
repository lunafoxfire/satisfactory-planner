import { z } from "zod";
import { GAME_VERSION } from "./game-version.ts";

export const MAX_USER_STRING_LENGTH = 255;
export const DEFAULT_FACTORY_NAME = "Unnamed Factory";

const ProductionTargetSchema = z.discriminatedUnion("mode", [
    z.object({
        id: z.string(),
        itemId: z.string().nullable(),
        mode: z.literal("itemsPerMinute"),
        rate: z.number(),
    }),
    z.object({
        id: z.string(),
        itemId: z.string().nullable(),
        mode: z.literal("fromRecipe"),
        recipeId: z.string().nullable(),
        multiplier: z.number(),
    }),
    z.object({
        id: z.string(),
        itemId: z.string().nullable(),
        mode: z.literal("maximize"),
        priority: z.number(),
    }),
]);

const SolverObjectiveSchema = z.enum([
    "minimizeResourceUsage",
    "minimizePowerUsage",
    "minimizeFactoryArea",
]);

const ProductionStateSchema = z.object({
    production: z.object({
        factoryName: z.string()
            .max(MAX_USER_STRING_LENGTH)
            .default(DEFAULT_FACTORY_NAME),
        targets: z.array(ProductionTargetSchema),
        objective: SolverObjectiveSchema,
    }),
});

const InputItemSchema = z.object({
    id: z.string(),
    itemId: z.string().nullable(),
    rate: z.number(),
    unlimited: z.boolean(),
});

const InputResourceSchema = z.object({
    itemId: z.string(),
    rate: z.number(),
    unlimited: z.boolean(),
});

const InputStateSchema = z.object({
    input: z.object({
        items: z.array(InputItemSchema),
        resources: z.array(InputResourceSchema),
        allowHandGathered: z.boolean(),
    }),
});

const RecipeStateSchema = z.object({
    recipes: z.object({
        enabled: z.record(z.string(), z.boolean()),
        conversionsEnabled: z.boolean(),
        ficsmasEnabled: z.boolean(),
    }),
});

const PlannerStateSchema = ProductionStateSchema
    .and(InputStateSchema)
    .and(RecipeStateSchema);

export const SharedFactorySchema = z.object({
    version: z.enum([GAME_VERSION]),
    data: PlannerStateSchema,
});

export type ProductionTarget = z.infer<typeof ProductionTargetSchema>;
export type SolverObjective = z.infer<typeof SolverObjectiveSchema>;
export type ProductionState = z.infer<typeof ProductionStateSchema>;

export type InputItem = z.infer<typeof InputItemSchema>;
export type InputResource = z.infer<typeof InputResourceSchema>;
export type InputState = z.infer<typeof InputStateSchema>;

export type RecipeState = z.infer<typeof RecipeStateSchema>;

export type PlannerState = z.infer<typeof PlannerStateSchema>;
export type SharedFactory = z.infer<typeof SharedFactorySchema>;
