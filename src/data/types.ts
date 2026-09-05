export interface Item {
    slug: string;
    name: string;
    sinkPoints: number;
    usedInRecipes: string[];
    producedFromRecipes: string[];
    isResource: boolean;
    isHandGathered: boolean;
    isFicsmas: boolean;
}

export interface ItemRate {
    itemId: string;
    perMinute: number;
}

export interface ItemAmount {
    itemId: string;
    quantity: number;
}

export interface Recipe {
    slug: string;
    name: string;
    isAlternate: boolean;
    isConversion: boolean;
    ingredients: ItemRate[];
    products: ItemRate[];
    producedIn: string;
    isFicsmas: boolean;
}

export interface Building {
    slug: string;
    name: string;
    power: number;
    area: number;
    buildCost: ItemAmount[];
    isFicsmas: boolean;
}

export interface Resource {
    maxExtraction: number;
    relativeValue: number;
}


export type ItemDictionary = Record<string, Item>;
export type RecipeDictionary = Record<string, Recipe>;
export type BuildingDictionary = Record<string, Building>;
export type ResourceDictionary = Record<string, Resource>;

export interface GameData {
    version: string;
    items: ItemDictionary;
    recipes: RecipeDictionary;
    buildings: BuildingDictionary;
    resources: ResourceDictionary;
}
