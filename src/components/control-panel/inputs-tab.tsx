import type { DropdownItem } from "#components/dropdown";
import { SectionCard } from "#components/section-card";
import { Button } from "#components/ui/button";
import { useGameData } from "#hooks/use-game-data";
import { usePlannerStore } from "#lib/store/planner/store";
import { Plus } from "lucide-react";
import { InputItem } from "./input-item";
import { InputResource } from "./input-resource";
import { CheckboxInput } from "#components/checkbox-input";
import { useMemo } from "react";

export function InputsTab() {
    const gameData = useGameData();

    const ficsmasEnabled = usePlannerStore((state) => state.recipes.ficsmasEnabled);

    const inputItems = usePlannerStore((state) => state.input.items);
    const addInputItem = usePlannerStore((state) => state.addInputItem);

    const inputResources = usePlannerStore((state) => state.input.resources);
    const sortedInputResources = [...inputResources].sort((a, b) => {
        const aValue = gameData.resources[a.itemId].relativeValue;
        const bValue = gameData.resources[b.itemId].relativeValue;
        return aValue - bValue;
    });

    const allowHandGathered = usePlannerStore((state) => state.input.allowHandGathered);
    const setAllowHandGathered = usePlannerStore((state) => state.setAllowHandGathered);

    const availableItems: DropdownItem[] = useMemo(() => Object.entries(gameData.items)
        .filter(([_, item]) =>
            !(
                item.isResource
                || item.isHandGathered
                || (item.isFicsmas && !ficsmasEnabled)
            )
            && (item.usedInRecipes.length > 0)
        )
        .map(([itemId, item]) => ({
            value: itemId,
            label: item.name,
        }))
        .sort((a, b) => {
            if (a.label > b.label) return 1;
            if (a.label < b.label) return -1;
            return 0;
        }), [gameData.items]);

    return (
        <div className="flex flex-col">
            <SectionCard
                title="Inputs"
                description="Select the inputs already available to your factory."
            >
                {inputItems.length === 0 ? (
                    <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                        <Button
                            variant="ghost"
                            onClick={addInputItem}
                        >
                            <Plus />
                            Add Input
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {inputItems.map((item) => (
                            <InputItem
                                key={item.id}
                                id={item.id}
                                items={availableItems}
                            />
                        ))}
                        <Button
                            size="sm"
                            onClick={addInputItem}
                        >
                            <Plus />
                            Add Input
                        </Button>
                    </div>
                )}
            </SectionCard>

            <SectionCard
                title="Resources"
                description="Select the resources your factory is allowed to use. The default values are the map limits."
            >
                <div className="mb-4">
                    <CheckboxInput
                        label="Allow hand-gathered resources (mycelia, leaves, etc)"
                        checked={allowHandGathered}
                        onCheckedChange={setAllowHandGathered}
                    />
                </div>
                <div className="flex flex-col gap-4">
                    {sortedInputResources.map((item) => (
                        <InputResource
                            key={item.itemId}
                            itemId={item.itemId}
                        />
                    ))}
                </div>
            </SectionCard>
        </div>
    );
}
