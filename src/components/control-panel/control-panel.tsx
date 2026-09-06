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

export function ControlPanel() {
    const [tab, setTab] = useState("production");

    return (
        <Tabs
            value={tab}
            onValueChange={setTab}
            className="flex h-full min-h-0 flex-col"
        >
            <TabsList className="grid w-auto grid-cols-3 -mb-1.5" variant="line">
                <TabsTrigger value="production">Production</TabsTrigger>
                <TabsTrigger value="inputs">Inputs</TabsTrigger>
                <TabsTrigger value="recipes">Recipes</TabsTrigger>
            </TabsList>

            <TabsContent
                value="production"
                className="min-h-0 flex-1"
            >
                <ProductionTab />
            </TabsContent>

            <TabsContent
                value="inputs"
                className="min-h-0 flex-1"
            >
                <InputsTab />
            </TabsContent>

            <TabsContent
                value="recipes"
                className="min-h-0 flex-1"
            >
                <RecipesTab />
            </TabsContent>
        </Tabs>
    );
}
