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

export function ReportsPanel() {
    const [tab, setTab] = useState("statistics");

    return (
        <aside className="absolute inset-y-0 right-0 z-20 flex flex-col w-100 min-h-0 border-l bg-background pb-14">
            <header className="flex h-10 shrink-0 items-center border-b bg-muted p-2">
                <h2 className="text-md font-semibold">// Reports</h2>
            </header>
            <Tabs
                value={tab}
                onValueChange={setTab}
                className="flex min-h-0 flex-1 flex-col"
            >
                <TabsList className="grid w-auto shrink-0 grid-cols-3 -mb-1.5" variant="line">
                    <TabsTrigger value="statistics">Statistics</TabsTrigger>
                    <TabsTrigger value="buildings">Buildings</TabsTrigger>
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
        </aside >
    );
}
