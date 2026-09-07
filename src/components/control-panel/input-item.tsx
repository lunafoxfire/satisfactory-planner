import { CheckboxInput } from "#components/checkbox-input";
import { Dropdown, type DropdownItem } from "#components/dropdown";
import { TextInput } from "#components/text-input";
import { Button } from "#components/ui/button";
import { usePlannerStore } from "#lib/store/store";
import { Trash2 } from "lucide-react";

interface InputItemProps {
    id: string;
    items: DropdownItem[];
}

export function InputItem({
    id,
    items,
}: InputItemProps) {
    const item = usePlannerStore((state) =>
        state.input.items.find((item) => item.id === id),
    );

    const setItem = usePlannerStore((state) => state.setInputItem);
    const setRate = usePlannerStore((state) => state.setInputItemRate);
    const setUnlimited = usePlannerStore((state) => state.setInputItemUnlimited);
    const removeItem = usePlannerStore((state) => state.removeInputItem);

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
                    aria-label="Remove input item"
                >
                    <Trash2 />
                </Button>
            </div>

            <div className="flex justify-between gap-2">
                <TextInput
                    label="Rate"
                    type="number"
                    disabled={item.unlimited}
                    min={0}
                    step={1}
                    value={item.rate}
                    onChange={(event) => setRate(id, Number(event.target.value))}
                    aria-label="Input items per minute"
                    className="flex-1"
                />
                <CheckboxInput
                    label="Unlimited"
                    checked={item.unlimited}
                    onCheckedChange={(checked) => { setUnlimited(id, checked); }}
                    className="w-fit flex-0 mt-3.5"
                />
            </div>
        </div>
    );
}
