import { ScrollArea } from "#components/ui/scroll-area";
import { ReportsPanel } from "./reports-panel";

type ReportsPanelContainerProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function ReportsPanelContainer({ }: ReportsPanelContainerProps) {

    return (
        <aside className="flex min-w-0 flex-col overflow-hidden border-l">
            <header className="flex h-10 shrink-0 items-center border-b p-2 bg-muted">
                <h2 className="text-m font-semibold">// Reports</h2>
            </header>

            <ScrollArea className="min-h-0 flex-1">
                <ReportsPanel />
            </ScrollArea>
        </aside>
    );
}
