import { useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "#components/ui/tabs";
import { StatisticsTab } from "./statistics-tab";
import { BuildingsTab } from "./buildings-tab";

export function ReportsPanel() {
    const [tab, setTab] = useState("statistics");

    return (
        <Tabs
            value={tab}
            onValueChange={setTab}
            className="flex h-full min-h-0 flex-col"
        >
            <TabsList className="grid w-auto grid-cols-3 -mb-1.5" variant="line">
                <TabsTrigger value="statistics">Statistics</TabsTrigger>
                <TabsTrigger value="buildings">Buildings</TabsTrigger>
            </TabsList>

            <TabsContent
                value="statistics"
                className="min-h-0 flex-1"
            >
                <StatisticsTab />
            </TabsContent>

            <TabsContent
                value="buildings"
                className="min-h-0 flex-1"
            >
                <BuildingsTab />
            </TabsContent>
        </Tabs>
    );
}
