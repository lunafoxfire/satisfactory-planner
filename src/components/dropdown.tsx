import { Check, ChevronsUpDown, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Button } from "#components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "#components/ui/command";
import {
    Field,
    FieldLabel,
} from "#components/ui/field";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "#components/ui/popover";
import { cn } from "#lib/utils";

export interface DropdownItem {
    value: string;
    label: string;
}

interface DropdownProps {
    items: DropdownItem[];
    value: string | null;
    onValueChange: (value: string | null) => void;
    label?: string;
    placeholder?: string;
    searchable?: boolean;
    clearable?: boolean;
    id?: string;
    className?: string;
}

export function Dropdown({
    items,
    value,
    onValueChange,
    label,
    placeholder,
    searchable,
    clearable,
    id: providedId,
    className,
}: DropdownProps) {
    const [open, setOpen] = useState(false);
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const commandListRef = useRef<HTMLDivElement>(null);
    const selectedItem = items.find((item) => item.value === value);

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

            <Popover
                open={open}
                onOpenChange={setOpen}
            >
                <PopoverTrigger
                    render={
                        <Button
                            id={id}
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="justify-between pr-1"
                        />
                    }
                >
                    <span className="truncate">
                        {selectedItem?.label ?? (
                            placeholder && (
                                <span className="text-muted-foreground">
                                    {placeholder}
                                </span>
                            )
                        )}
                    </span>

                    <span className="flex shrink-0 items-center">
                        {clearable && selectedItem
                            ? (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Clear selection"
                                    className="w-6 shrink-0 text-muted-foreground opacity-50"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onValueChange(null);
                                    }}
                                >
                                    <X />
                                </Button>
                            )
                            : (
                                <ChevronsUpDown className="mr-1 w-6 shrink-0 text-muted-foreground opacity-50" />
                            )}
                    </span>
                </PopoverTrigger>

                <PopoverContent
                    align="start"
                    className="w-(--anchor-width) p-0"
                >
                    <Command>
                        {searchable && (
                            <CommandInput
                                placeholder="Search items..."
                                onValueChange={() => {
                                    commandListRef.current?.scrollTo({
                                        top: 0,
                                        behavior: "instant",
                                    });
                                }}
                            />
                        )}

                        <CommandList ref={commandListRef}>
                            <CommandEmpty>No items found.</CommandEmpty>

                            <CommandGroup>
                                {items.map((item) => (
                                    <CommandItem
                                        key={item.value}
                                        value={item.label}
                                        onSelect={() => {
                                            onValueChange(item.value);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2",
                                                value === item.value
                                                    ? "visible"
                                                    : "invisible",
                                            )}
                                        />
                                        {item.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </Field>
    );
}
