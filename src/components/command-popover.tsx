import { Fragment, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "#components/ui/button";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "#components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "#components/ui/popover";

export interface CommandItem {
    onTrigger: () => void;
    render: ReactNode;
}

export interface CommandGroup {
    heading: string;
    commands: CommandItem[];
}

interface CommandPopoverProps {
    commandGroups: CommandGroup[];
    label: string;
}

export function CommandPopover({
    label,
    commandGroups,
}: CommandPopoverProps) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <Button>
                    {label}
                    <ChevronDown className="ml-2 size-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-0">
                <Command>
                    <CommandList>
                        {commandGroups.map((group, groupIndex) => (
                            <Fragment key={`${group.heading}-${groupIndex}`}>
                                <CommandGroup heading={group.heading}>
                                    {group.commands.map((command, commandIndex) => (
                                        <CommandItem
                                            key={commandIndex}
                                            onSelect={() => {
                                                command.onTrigger();
                                                setOpen(false);
                                            }}
                                        >
                                            {command.render}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                                <CommandSeparator />
                            </Fragment>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
