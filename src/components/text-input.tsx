import { useId } from "react";
import { Field, FieldLabel } from "#components/ui/field";
import { Input } from "#components/ui/input";
import { cn } from "#lib/utils";

export interface TextInputProps
    extends React.ComponentProps<"input"> {
    label?: string;
    id?: string;
    className?: string;
    inputClassName?: string;
}

export function TextInput({
    label,
    id: providedId,
    className,
    inputClassName,
    ...inputProps
}: TextInputProps) {
    const generatedId = useId();
    const id = providedId ?? generatedId;

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

            <Input
                {...inputProps}
                id={id}
                className={inputClassName}
            />
        </Field>
    );
}
