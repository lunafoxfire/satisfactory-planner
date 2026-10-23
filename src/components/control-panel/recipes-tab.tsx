import { useDeferredValue, useMemo, useState } from "react";
import { CheckboxInput } from "#components/checkbox-input";
import { SectionCard } from "#components/section-card";
import { TextInput } from "#components/text-input";
import { useGameData } from "#hooks/use-game-data";
import { usePlannerStore } from "#lib/store/planner/store";
import { CommandPopover, type CommandItem } from "#components/command-popover";

export function RecipesTab() {
    const gameData = useGameData();
    const enabledRecipes = usePlannerStore((state) => state.recipes.enabled);
    const setRecipeEnabled = usePlannerStore((state) => state.setRecipeEnabled);
    const enableAll = usePlannerStore((state) => state.setAllRecipesEnabled);
    const enableStandard = usePlannerStore((state) => state.setStandardRecipesEnabled);
    const enableNone = usePlannerStore((state) => state.setNoRecipesEnabled);
    const disableByBuilding = usePlannerStore((state) => state.disableRecipesByBuilding);

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
                const name = recipe.name;

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

    const disableByBuildingCommands: CommandItem[] = useMemo(() => {
        return Object.entries(gameData.buildings)
            .filter(([_, building]) => !(building.isResourceExtractor || building.power < 0))
            .map(([buildingId, building]) => ({
                render: building.name,
                onTrigger: () => { disableByBuilding(gameData, buildingId); }
            }))
            .reverse();
    }, [gameData, disableByBuilding]);

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

                    <div className="flex gap-4">
                        <TextInput
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search recipes..."
                            search
                        />
                        <CommandPopover
                            label="Select Recipes"
                            commandGroups={[
                                {
                                    heading: "Set Recipes",
                                    commands: [
                                        {
                                            render: "All",
                                            onTrigger: enableAll,
                                        },
                                        {
                                            render: "Standard Only",
                                            onTrigger: () => enableStandard(gameData),
                                        },
                                        {
                                            render: "None",
                                            onTrigger: enableNone,
                                        },
                                    ],
                                },
                                {
                                    heading: "Disable Recipes By Building",
                                    commands: disableByBuildingCommands,
                                },
                            ]}
                        />
                    </div>

                    <div className="flex gap-2">
                        <div className="flex-1 flex flex-col gap-2">
                            <span className="text-sm font-semibold border-b pb-1">
                                Standard
                            </span>

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
                            <span className="text-sm font-semibold border-b pb-1">
                                Alternate
                            </span>

                            {alternateRecipes.map((recipe) => (
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
                    </div>
                </div>
            </SectionCard>
        </div>
    );
}
