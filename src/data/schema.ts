import { z } from "zod";

export const ItemSchema = z.object({
    slug: z.string(),
    name: z.string(),
    sinkPoints: z.number(),
    usedInRecipes: z.array(z.string()),
    producedFromRecipes: z.array(z.string()),
    isResource: z.boolean(),
    isHandGathered: z.boolean(),
    isFicsmas: z.boolean(),
});

export const ItemRateSchema = z.object({
    itemId: z.string(),
    perMinute: z.number(),
});

export const ItemAmountSchema = z.object({
    itemId: z.string(),
    quantity: z.number(),
});

export const RecipeSchema = z.object({
    slug: z.string(),
    name: z.string(),
    isAlternate: z.boolean(),
    isConversion: z.boolean(),
    ingredients: z.array(ItemRateSchema),
    products: z.array(ItemRateSchema),
    producedIn: z.string(),
    isFicsmas: z.boolean(),
});

export const BuildingSchema = z.object({
    slug: z.string(),
    name: z.string(),
    power: z.number(),
    area: z.number(),
    buildCost: z.array(ItemAmountSchema),
    isFicsmas: z.boolean(),
});

export const ResourceSchema = z.object({
    maxExtraction: z.number(),
    relativeValue: z.number(),
});

export const ItemDictionarySchema = z.record(z.string(), ItemSchema);
export const RecipeDictionarySchema = z.record(z.string(), RecipeSchema);
export const BuildingDictionarySchema = z.record(z.string(), BuildingSchema);
export const ResourceDictionarySchema = z.record(z.string(), ResourceSchema);

export const GameDataSchema = z.object({
    version: z.string(),
    items: ItemDictionarySchema,
    recipes: RecipeDictionarySchema,
    buildings: BuildingDictionarySchema,
    resources: ResourceDictionarySchema,
});

export type Item = z.infer<typeof ItemSchema>;
export type ItemRate = z.infer<typeof ItemRateSchema>;
export type ItemAmount = z.infer<typeof ItemAmountSchema>;
export type Recipe = z.infer<typeof RecipeSchema>;
export type Building = z.infer<typeof BuildingSchema>;
export type Resource = z.infer<typeof ResourceSchema>;

export type ItemDictionary = z.infer<typeof ItemDictionarySchema>;
export type RecipeDictionary = z.infer<typeof RecipeDictionarySchema>;
export type BuildingDictionary = z.infer<typeof BuildingDictionarySchema>;
export type ResourceDictionary = z.infer<typeof ResourceDictionarySchema>;

export type GameData = z.infer<typeof GameDataSchema>;
