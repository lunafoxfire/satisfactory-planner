import { useId, useRef } from "react";
import { Checkbox } from "#components/ui/checkbox";
import { Field, FieldLabel } from "#components/ui/field";
import { cn } from "#lib/utils";

export interface CheckboxInputProps
    extends React.ComponentProps<typeof Checkbox> {
    label?: string;
    id?: string;
    variant?: "default" | "compact";
    className?: string;
}

export function CheckboxInput({
    label,
    id: providedId,
    variant = "default",
    className,
    ...checkboxProps
}: CheckboxInputProps) {
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const checkboxRef = useRef<HTMLButtonElement>(null);

    return (
        <Field
            orientation="horizontal"
            className={cn(
                "w-full",
                variant === "compact" && "gap-1",
                className,
            )}
        >
            <Checkbox
                {...checkboxProps}
                ref={checkboxRef}
                id={id}
                className={cn(
                    "cursor-pointer",
                    variant === "compact" && "size-3 [&_svg]:size-1",
                )}
                indicatorClassName={cn(
                    variant === "compact" && "[&>svg]:size-2.5",
                )}
            />

            {label && (
                <FieldLabel
                    htmlFor={id}
                    onClick={(event) => { checkboxRef.current?.click(); event.preventDefault(); }}
                    className={cn(
                        "cursor-pointer",
                        variant === "compact" && "text-[0.75rem]",
                    )}
                >
                    {label}
                </FieldLabel>
            )}
        </Field>
    );
}
