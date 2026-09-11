import { Trash2 } from "lucide-react";
import { Button } from "#components/ui/button";
import { usePlannerStore } from "#lib/store/planner/store";
import { Dropdown, type DropdownItem } from "#components/dropdown";
import { TextInput } from "#components/text-input";
import { useGameData } from "#hooks/use-game-data";
import { useMemo } from "react";

interface ProductionTargetProps {
    id: string;
    items: DropdownItem[];
}

export function ProductionTarget({
    id,
    items,
}: ProductionTargetProps) {
    const gameData = useGameData();

    const productionTarget = usePlannerStore((state) =>
        state.production.targets.find((productionTarget) => productionTarget.id === id),
    );

    const setItem = usePlannerStore((state) => state.setProductionTargetItem);
    const setMode = usePlannerStore((state) => state.setProductionTargetMode);
    const setRate = usePlannerStore((state) => state.setProductionTargetRate);
    const setMultiplier = usePlannerStore((state) => state.setProductionTargetMultiplier);
    const setPriority = usePlannerStore((state) => state.setProductionTargetPriority);
    const removeItem = usePlannerStore((state) => state.removeProductionTarget);

    const item = productionTarget?.itemId ? gameData.items[productionTarget.itemId] : null;
    const recipeOptions: DropdownItem[] = useMemo(() => {
        const recipeOptions: DropdownItem[] = [];
        if (!item || !productionTarget) return recipeOptions;
        for (const recipeId of item.producedFromRecipes) {
            const recipe = gameData.recipes[recipeId];
            if (!recipe) continue;
            const rate = recipe.products.find((p) => p.itemId === productionTarget.itemId)?.perMinute ?? 0;
            recipeOptions.push({
                value: recipeId,
                label: `Recipe: ${recipe.name} (${rate} / min)`,
            });
        }
        return recipeOptions;
    }, [item, productionTarget, gameData]);

    if (!productionTarget) {
        return null;
    }

    return (
        <div className="flex flex-col gap-2 rounded-sm border p-2">
            <div className="flex gap-2">
                <Dropdown
                    label="Item"
                    searchable
                    clearable
                    placeholder="Select an item"
                    items={items}
                    value={productionTarget.itemId}
                    onValueChange={(itemId) => setItem(id, itemId)}
                />

                <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-destructive mt-3.5"
                    onClick={() => removeItem(id)}
                    aria-label="Remove production target"
                >
                    <Trash2 />
                </Button>
            </div>

            <div className="flex min-w-0 gap-2">
                <Dropdown
                    label="Mode"
                    className="min-w-0 flex-1"
                    value={
                        productionTarget.mode === "fromRecipe"
                            ? productionTarget.recipeId
                            : productionTarget.mode
                    }
                    onValueChange={(value) => {
                        if (
                            value === "itemsPerMinute" ||
                            value === "maximize"
                        ) {
                            setMode(id, value, null);
                        }
                        else {
                            setMode(id, "fromRecipe", value);
                        }
                    }}
                    items={[
                        {
                            value: "itemsPerMinute",
                            label: "Items Per Min"
                        },
                        ...recipeOptions,
                        {
                            value: "maximize",
                            label: "Maximize"
                        },
                    ]}
                />

                {productionTarget.mode === "itemsPerMinute" && (
                    <TextInput
                        label="Rate"
                        type="number"
                        min={0}
                        step={1}
                        value={productionTarget.rate}
                        onChange={(event) => setRate(id, Number(event.target.value))}
                        aria-label="Target items per minute"
                        className="w-24 shrink-0"
                    />
                )}

                {productionTarget.mode === "fromRecipe" && (
                    <TextInput
                        label="Multiplier"
                        type="number"
                        min={0}
                        step={1}
                        value={productionTarget.multiplier}
                        onChange={(event) => setMultiplier(id, Number(event.target.value))}
                        aria-label="Target recipe multiplier"
                        className="w-24 shrink-0"
                    />
                )}

                {productionTarget.mode === "maximize" && (
                    <TextInput
                        label="Priority"
                        type="number"
                        min={0}
                        step={1}
                        value={productionTarget.priority}
                        onChange={(event) => setPriority(id, Number(event.target.value))}
                        aria-label="Maximization priority"
                        className="w-24 shrink-0"
                    />
                )}
            </div>
        </div>
    );
}
