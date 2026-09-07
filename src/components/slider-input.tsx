import { useId } from "react";
import { Slider } from "#components/ui/slider";
import { Field, FieldLabel } from "#components/ui/field";
import { Input } from "#components/ui/input";
import { cn } from "#lib/utils";

export interface SliderInputProps {
    label?: string;
    id?: string;
    value: number;
    onValueChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    className?: string;
    sliderClassName?: string;
    inputClassName?: string;
}

export function SliderInput({
    label,
    id: providedId,
    value,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    disabled,
    className,
    sliderClassName,
    inputClassName,
}: SliderInputProps) {
    const generatedId = useId();
    const id = providedId ?? generatedId;

    const setValue = (nextValue: number) => {
        onValueChange(nextValue);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextValue = Number(event.target.value);
        if (Number.isFinite(nextValue)) {
            setValue(nextValue);
        }
    };

    return (
        <Field
            className={cn(
                "w-full relative",
                !!label && "mt-4",
                className
            )}
        >
            {label && (
                <FieldLabel
                    htmlFor={id}
                    className="absolute -top-4.5 text-[0.9em]"
                >
                    {label}
                </FieldLabel>
            )}

            <div className="flex items-center gap-3">
                <Slider
                    id={id}
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onValueChange={(nextValue) => {
                        if (typeof nextValue === "number") {
                            setValue(nextValue);
                        }
                    }}
                    disabled={disabled}
                    className={cn("flex-1", sliderClassName)}
                />

                <Input
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleInputChange}
                    disabled={disabled}
                    className={cn("w-20", inputClassName)}
                />
            </div>
        </Field>
    );
}
