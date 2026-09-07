import { useDeferredValue, useMemo, useState } from "react";
import { CheckboxInput } from "#components/checkbox-input";
import { SectionCard } from "#components/section-card";
import { TextInput } from "#components/text-input";
import { useGameData } from "#hooks/use-game-data";
import { usePlannerStore } from "#lib/store/store";
import { Button } from "#components/ui/button";

export function RecipesTab() {
    const gameData = useGameData();
    const enabledRecipes = usePlannerStore((state) => state.recipes.enabled);
    const setRecipeEnabled = usePlannerStore((state) => state.setRecipeEnabled);
    const enableAll = usePlannerStore((state) => state.setAllRecipesEnabled);
    const enableStandard = usePlannerStore((state) => state.setStandardRecipesEnabled);
    const enableNone = usePlannerStore((state) => state.setNoRecipesEnabled);

    const conversionsEnabled = usePlannerStore((state) => state.recipes.conversionsEnabled);
    const setConversionsEnabled = usePlannerStore((state) => state.setConversionsEnabled);

    const ficsmasEnabled = usePlannerStore((state) => state.recipes.ficsmasEnabled);
    const setFicsmasEnabled = usePlannerStore((state) => state.setFicsmasEnabled);

    const [search, setSearch] = useState("");
    const deferredSearch = useDeferredValue(search);
    const normalizedSearch = deferredSearch.trim().toLowerCase();

    const recipes = useMemo(() => {
        return Object.entries(enabledRecipes)
            .map(([recipeId, enabled]) => {
                const recipe = gameData.recipes[recipeId];
                const name = recipe.name.replace("Alternate: ", "");

                return {
                    recipeId,
                    enabled,
                    name,
                    normalizedName: name.toLowerCase(),
                    isAlternate: recipe.isAlternate,
                    isConversion: recipe.isConversion,
                    isFicsmas: recipe.isFicsmas,
                };
            })
            .sort((a, b) => {
                if (a.name > b.name) return 1;
                if (a.name < b.name) return -1;
                return 0;
            });
    }, [enabledRecipes, gameData.recipes]);

    const { standardRecipes, alternateRecipes } = useMemo(() => {
        const standard = [];
        const alternate = [];

        for (const recipe of recipes) {
            if (!conversionsEnabled && recipe.isConversion) {
                continue;
            }
            if (!ficsmasEnabled && recipe.isFicsmas) {
                continue;
            }
            if (!recipe.normalizedName.includes(normalizedSearch)) {
                continue;
            }

            if (recipe.isAlternate) {
                alternate.push(recipe);
            } else {
                standard.push(recipe);
            }
        }

        return {
            standardRecipes: standard,
            alternateRecipes: alternate,
        };
    }, [recipes, conversionsEnabled, ficsmasEnabled, normalizedSearch]);

    return (
        <div className="flex flex-col">
            <SectionCard
                title="Recipes"
                description="Select the recipes available to your factory."
            >
                <div className="flex flex-col gap-2">
                    <CheckboxInput
                        label="Enable Converter conversion recipes"
                        checked={conversionsEnabled}
                        onCheckedChange={setConversionsEnabled}
                    />
                    <CheckboxInput
                        label="Enable FICSMAS recipes"
                        checked={ficsmasEnabled}
                        onCheckedChange={setFicsmasEnabled}
                    />
                    <div className="border-b" />
                    <TextInput
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search recipes..."
                        search
                    />
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={enableAll}
                        >
                            All
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => { enableStandard(gameData); }}
                        >
                            Standard
                        </Button>
                        <Button
                            variant="outline"
                            onClick={enableNone}
                        >
                            None
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1 flex flex-col gap-2">
                            <span className="text-sm font-semibold border-b pb-1">Standard</span>
                            {standardRecipes.map((recipe) => (
                                <CheckboxInput
                                    key={recipe.recipeId}
                                    label={recipe.name}
                                    checked={recipe.enabled}
                                    onCheckedChange={(checked) => {
                                        setRecipeEnabled(recipe.recipeId, checked);
                                    }}
                                    variant="compact"
                                />
                            ))}
                        </div>
                        <div className="border-l" />
                        <div className="flex-1 flex flex-col gap-2">
                            <span className="text-sm font-semibold border-b pb-1">Alternate</span>
                            {alternateRecipes.map((recipe) => (
                                <CheckboxInput
                                    key={recipe.recipeId}
                                    label={recipe.name.replace("Alternate: ", "")}
                                    checked={recipe.enabled}
                                    onCheckedChange={(checked) => {
                                        setRecipeEnabled(recipe.recipeId, checked);
                                    }}
                                    variant="compact"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </SectionCard>
        </div>
    );
}
