import { CheckboxInput } from "#components/checkbox-input";
import { SliderInput } from "#components/slider-input";
import { useGameData } from "#hooks/use-game-data";
import { usePlannerStore } from "#lib/store/store";

interface InputResourceProps {
    itemId: string;
}

export function InputResource({ itemId }: InputResourceProps) {
    const gameData = useGameData();
    const item = usePlannerStore((state) =>
        state.input.resources.find((item) => item.itemId === itemId),
    );

    const setRate = usePlannerStore((state) => state.setInputResourceRate);
    const setUnlimited = usePlannerStore((state) => state.setInputResourceUnlimited);

    if (!item) {
        return null;
    }

    const resourceData = gameData.resources[item.itemId];
    const itemData = gameData.items[item.itemId];
    if (!resourceData || !itemData) {
        return null;
    }

    return (
        <div className="flex items-center rounded-sm border p-2">
            <div className="w-24 flex-initial">{itemData.name}</div>
            <div className="flex flex-col gap-2 flex-1">
                <SliderInput
                    disabled={item.unlimited}
                    min={0}
                    max={resourceData.maxExtraction}
                    step={1}
                    value={item.rate}
                    onValueChange={(value) => setRate(itemId, value)}
                    aria-label="Resource extraction limit"
                    className="flex-1"
                />
                <CheckboxInput
                    label="Unlimited"
                    checked={item.unlimited}
                    onCheckedChange={(checked) => { setUnlimited(itemId, checked); }}
                />

            </div>
        </div>

    );
}
