import { Trash2 } from "lucide-react";
import { Button } from "#components/ui/button";
import { usePlannerStore } from "#lib/store/store";
import { Dropdown, type DropdownItem } from "#components/dropdown";
import { TextInput } from "#components/text-input";

interface ProductionTargetProps {
    id: string;
    items: DropdownItem[];
}

export function ProductionTarget({
    id,
    items,
}: ProductionTargetProps) {
    const item = usePlannerStore((state) =>
        state.production.targets.find((item) => item.id === id),
    );

    const setItem = usePlannerStore((state) => state.setProductionTargetItem);
    const setMode = usePlannerStore((state) => state.setProductionTargetMode);
    const setRate = usePlannerStore((state) => state.setProductionTargetRate);
    const setMultiplier = usePlannerStore((state) => state.setProductionTargetMultiplier);
    const setPriority = usePlannerStore((state) => state.setProductionTargetPriority);
    const removeItem = usePlannerStore((state) => state.removeProductionTarget);

    if (!item) {
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
                    value={item.itemId}
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

            <div className="flex gap-2">
                <Dropdown
                    label="Mode"
                    className="flex-2"
                    value={item.mode}
                    onValueChange={(mode) => {
                        if (
                            mode === "itemsPerMinute" ||
                            mode === "fromRecipe" ||
                            mode === "maximize"
                        ) {
                            setMode(id, mode);
                        }
                    }}
                    items={[
                        {
                            value: "itemsPerMinute",
                            label: "Items Per Min"
                        },
                        {
                            value: "fromRecipe",
                            label: "From Recipe"
                        },
                        {
                            value: "maximize",
                            label: "Maximize"
                        },
                    ]}
                />

                {item.mode === "itemsPerMinute" && (
                    <TextInput
                        label="Rate"
                        type="number"
                        min={0}
                        step={1}
                        value={item.rate}
                        onChange={(event) => setRate(id, Number(event.target.value))}
                        aria-label="Target items per minute"
                        className="flex-1"
                    />
                )}

                {item.mode === "fromRecipe" && (
                    <TextInput
                        label="Multiplier"
                        type="number"
                        min={0}
                        step={1}
                        value={item.multiplier}
                        onChange={(event) => setMultiplier(id, Number(event.target.value))}
                        aria-label="Target recipe multiplier"
                        className="flex-1"
                    />
                )}

                {item.mode === "maximize" && (
                    <TextInput
                        label="Priority"
                        type="number"
                        min={0}
                        step={1}
                        value={item.priority}
                        onChange={(event) => setPriority(id, Number(event.target.value))}
                        aria-label="Maximization priority"
                        className="flex-1"
                    />
                )}
            </div>
        </div>
    );
}
