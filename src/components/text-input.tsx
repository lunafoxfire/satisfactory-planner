import { useId } from "react";
import { Search } from "lucide-react";
import { Field, FieldLabel } from "#components/ui/field";
import { Input } from "#components/ui/input";
import { cn } from "#lib/utils";

export interface TextInputProps
    extends React.ComponentProps<"input"> {
    label?: string;
    search?: boolean;
    id?: string;
    className?: string;
    inputClassName?: string;
}

export function TextInput({
    label,
    search,
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
            {search && (
                <div className="pointer-events-none absolute z-10 right-2 top-1/2 -translate-y-1/2 w-4! text-muted-foreground opacity-50">
                    <Search
                        className="size-4"
                    />
                </div>
            )}
            <Input
                {...inputProps}
                id={id}
                className={cn(
                    search && "pr-7",
                    inputClassName
                )}
            />
        </Field>
    );
}
