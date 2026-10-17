import { useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "#components/ui/tabs";
import { ScrollArea } from "#components/ui/scroll-area";
import { StatisticsTab } from "./statistics-tab";
import { BuildingsTab } from "./buildings-tab";
import { cn } from "#lib/utils";
import { ChartColumn, ChevronsLeft, ChevronsRight, Factory } from "lucide-react";

export function ReportsPanel() {
    const [tab, setTab] = useState("statistics");
    const [open, setOpen] = useState(true);

    return (
        <aside
            className={cn(
                "absolute inset-y-0 right-0 z-40 flex flex-col w-[33%] max-w-120 min-w-72 min-h-0 border-l bg-background/70 backdrop-blur-xs",
                "transform-gpu transition-transform duration-300 ease-[cubic-bezier(0, 0.5, 0.5, 1)] motion-reduce:transition-none",
                open ? "translate-x-0" : "translate-x-full"
            )}
        >
            <header className="flex h-10 shrink-0 items-center border-b bg-muted p-2">
                <h2 className="text-md font-semibold">// Reports</h2>
            </header>
            <Tabs
                value={tab}
                onValueChange={setTab}
                className="flex min-h-0 flex-1 flex-col"
            >
                <TabsList className="grid w-auto shrink-0 grid-cols-3 -mb-1.5" variant="line">
                    <TabsTrigger value="statistics"><ChartColumn /> Statistics</TabsTrigger>
                    <TabsTrigger value="buildings"><Factory /> Buildings</TabsTrigger>
                </TabsList>

                <TabsContent
                    value="statistics"
                    className="min-h-0 flex-1 overflow-hidden"
                >
                    <ScrollArea className="h-full">
                        <StatisticsTab />
                    </ScrollArea>
                </TabsContent>

                <TabsContent
                    value="buildings"
                    className="min-h-0 flex-1 overflow-hidden"
                >
                    <ScrollArea className="h-full">
                        <BuildingsTab />
                    </ScrollArea>
                </TabsContent>
            </Tabs>
            <div
                className="absolute top-0 bottom-0 -left-2 w-2 bg-muted"
            >
                <button
                    className="absolute top-1/2 right-2 -translate-y-1/2 w-4 h-28 bg-muted [clip-path:polygon(0%_15%,0%_85%,110%_100%,110%_0%)]"
                    onClick={() => { setOpen((open) => !open); }}
                >
                    <span className="absolute top-1/2 left-0.5 -translate-y-1/2">
                        {open ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
                    </span>
                </button>
            </div>
        </aside >
    );
}
