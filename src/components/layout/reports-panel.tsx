import { Button } from "#components/ui/button";
import { ScrollArea } from "#components/ui/scroll-area";

type ReportsPanelProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function ReportsPanel({ open, onOpenChange }: ReportsPanelProps) {
    if (!open) {
        return (
            <div className="overflow-hidden">
                <Button
                    className="absolute right-2 top-2"
                    onClick={() => onOpenChange(true)}
                >
                    Reports
                </Button>
            </div>
        );
    }

    return (
        <aside className="flex min-w-0 flex-col overflow-hidden border-l">
            <header className="flex h-12 shrink-0 items-center justify-between border-b px-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                >
                    Collapse
                </Button>

                <h2 className="text-sm font-semibold">Reports</h2>
            </header>

            <ScrollArea className="min-h-0 flex-1">
                <div className="space-y-6 p-4">
                    {/* report */}
                </div>
            </ScrollArea>
        </aside>
    );
}
