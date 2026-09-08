import { useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "#components/ui/tabs";
import { ProductionTab } from "./production-tab";
import { InputsTab } from "./inputs-tab";
import { RecipesTab } from "./recipes-tab";
import { ScrollArea } from "#components/ui/scroll-area";
import { Button } from "#components/ui/button";
import { solve } from "#lib/solver/solver";
import { useGameData } from "#hooks/use-game-data";
import { usePlannerStore } from "#lib/store/store";

export function ControlPanel() {
    const [tab, setTab] = useState("production");
    const gameData = useGameData();
    const plannerStore = usePlannerStore((state) => state);

    return (
        <aside className="absolute inset-y-0 left-0 z-20 flex flex-col w-100 min-h-0 border-r bg-background pb-14">
            <header className="flex h-10 shrink-0 items-center border-b bg-muted p-2">
                <h2 className="text-md font-semibold">// Control Panel</h2>
            </header>
            <Button
                onClick={() => { solve(gameData, plannerStore); }}
            >
                Solve
            </Button>
            <Tabs
                value={tab}
                onValueChange={setTab}
                className="flex min-h-0 flex-1 flex-col"
            >
                <TabsList className="grid w-auto shrink-0 grid-cols-3 -mb-1.5" variant="line">
                    <TabsTrigger value="production">Production</TabsTrigger>
                    <TabsTrigger value="inputs">Inputs</TabsTrigger>
                    <TabsTrigger value="recipes">Recipes</TabsTrigger>
                </TabsList>

                <TabsContent
                    value="production"
                    className="min-h-0 flex-1 overflow-hidden"
                >
                    <ScrollArea className="h-full">
                        <ProductionTab />
                    </ScrollArea>
                </TabsContent>

                <TabsContent
                    value="inputs"
                    className="min-h-0 flex-1 overflow-hidden"
                >
                    <ScrollArea className="h-full">
                        <InputsTab />
                    </ScrollArea>
                </TabsContent>

                <TabsContent
                    value="recipes"
                    className="min-h-0 flex-1 overflow-hidden"
                >
                    <ScrollArea className="h-full">
                        <RecipesTab />
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </aside >
    );
}
