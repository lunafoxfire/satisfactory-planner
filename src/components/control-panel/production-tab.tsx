import { useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "#components/ui/button";
import { usePlannerStore } from "#lib/store/store";
import { useGameData } from "#hooks/use-game-data";
import { SectionCard } from "#components/section-card";
import type { DropdownItem } from "#components/dropdown";
import { ProductionTarget } from "./production-target";


export function ProductionTab() {
    const gameData = useGameData();

    const productionTargets = usePlannerStore((state) => state.production.targets);
    const addProductionTarget = usePlannerStore((state) => state.addProductionTarget);

    const producableItems: DropdownItem[] = useMemo(() => Object.entries(gameData.items)
        .filter(([_, item]) => item.producedFromRecipes.length > 0)
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
                title="Production Targets"
                description="Select your production targets. When maximizing multiple outputs, the lower priority number will be maximized first."
            >
                {productionTargets.length === 0 ? (
                    <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                        <Button
                            variant="ghost"
                            onClick={addProductionTarget}
                        >
                            <Plus />
                            Add Product
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {productionTargets.map((target) => (
                            <ProductionTarget
                                key={target.id}
                                id={target.id}
                                items={producableItems}
                            />
                        ))}
                        <Button
                            size="sm"
                            onClick={addProductionTarget}
                        >
                            <Plus />
                            Add Product
                        </Button>
                    </div>
                )}
            </SectionCard>
        </div>
    );
}
