import { useState } from "react";
import { ArrowRightFromLine, Book, ChevronsLeft, ChevronsRight, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#components/ui/tabs";
import { ProductionTab } from "./production-tab";
import { InputsTab } from "./inputs-tab";
import { RecipesTab } from "./recipes-tab";
import { ScrollArea } from "#components/ui/scroll-area";
import { cn } from "#lib/utils";

export function ControlPanel() {
    const [tab, setTab] = useState("production");
    const [open, setOpen] = useState(true);

    return (
        <aside
            className={cn(
                "absolute inset-y-0 left-0 z-50 flex flex-col w-[33%] max-w-120 min-w-72 min-h-0 border-r bg-background/70 backdrop-blur-xs",
                "transform-gpu transition-transform duration-300 ease-[cubic-bezier(0, 0.5, 0.5, 1)] motion-reduce:transition-none",
                open ? "translate-x-0" : "-translate-x-full"
            )}
        >
            <header className="flex h-10 shrink-0 items-center border-b bg-muted p-2">
                <h2 className="text-md font-semibold uppercase">// Control Panel</h2>
            </header>
            <Tabs
                value={tab}
                onValueChange={setTab}
                className="flex min-h-0 flex-1 flex-col"
            >
                <TabsList className="grid w-auto shrink-0 grid-cols-3 -mb-1.5" variant="line">
                    <TabsTrigger value="production"><TrendingUp /> Production</TabsTrigger>
                    <TabsTrigger value="inputs"><ArrowRightFromLine /> Inputs</TabsTrigger>
                    <TabsTrigger value="recipes"><Book />Recipes</TabsTrigger>
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
            <div
                className="absolute top-0 bottom-0 -right-2 w-2 bg-muted"
            >
                <button
                    className="absolute top-1/2 left-2 -translate-y-1/2 w-4 h-28 bg-muted [clip-path:polygon(-10%_0%,-10%_100%,100%_85%,100%_15%)]"
                    onClick={() => { setOpen((open) => !open); }}
                >
                    <span className="absolute top-1/2 right-0.5 -translate-y-1/2">
                        {open ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
                    </span>
                </button>
            </div>
        </aside >
    );
}
