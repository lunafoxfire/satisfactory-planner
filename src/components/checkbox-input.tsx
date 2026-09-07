import { useId } from "react";
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
                id={id}
                className={cn(
                    variant === "compact" && "size-3 [&_svg]:size-1",
                )}
                indicatorClassName={cn(
                    variant === "compact" && "[&>svg]:size-2.5",
                )}
            />

            {label && (
                <FieldLabel
                    htmlFor={id}
                    className={cn(
                        variant === "compact" && "text-[0.7rem]",
                    )}
                >
                    {label}
                </FieldLabel>
            )}
        </Field>
    );
}
