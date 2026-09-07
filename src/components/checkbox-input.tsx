import { useId } from "react";
import { Checkbox } from "#components/ui/checkbox";
import { Field, FieldLabel } from "#components/ui/field";
import { cn } from "#lib/utils";

export interface CheckboxInputProps
    extends React.ComponentProps<typeof Checkbox> {
    label?: string;
    id?: string;
    className?: string;
}

export function CheckboxInput({
    label,
    id: providedId,
    className,
    ...checkboxProps
}: CheckboxInputProps) {
    const generatedId = useId();
    const id = providedId ?? generatedId;

    return (
        <Field
            orientation="horizontal"
            className={cn("w-full", className)}
        >
            <Checkbox
                {...checkboxProps}
                id={id}
            />

            {label && (
                <FieldLabel htmlFor={id}>
                    {label}
                </FieldLabel>
            )}
        </Field>
    );
}
