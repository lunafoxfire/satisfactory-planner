import { Button } from "#components/ui/button";
import { ScrollArea } from "#components/ui/scroll-area";

type InputsPanelProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function InputsPanel({ open, onOpenChange }: InputsPanelProps) {
    if (!open) {
        return (
            <div className="overflow-hidden">
                <Button
                    className="absolute left-2 top-2"
                    onClick={() => onOpenChange(true)}
                >
                    Inputs
                </Button>
            </div>
        );
    }

    return (
        <aside className="flex min-w-0 flex-col overflow-hidden border-r">
            <header className="flex h-12 shrink-0 items-center justify-between border-b px-3">
                <h2 className="text-sm font-semibold">Inputs</h2>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                >
                    Collapse
                </Button>
            </header>

            <ScrollArea className="min-h-0 flex-1">
                <div className="space-y-6 p-4">
                    {/* inputs */}
                </div>
            </ScrollArea>
        </aside>
    );
}
