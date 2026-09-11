import { GameDataProvider } from "#providers/game-data-provider";
import { AppHeader } from "./app-header";
import { AppWorkspace } from "./app-workspace";
import { PlannerBootstrap } from "./planner-bootstrap";

export function AppShell() {
    return (
        <div className="flex h-svh flex-col">
            <GameDataProvider>
                <PlannerBootstrap>
                    <AppHeader />

                    <div className="min-h-0 flex-1">
                        <AppWorkspace />
                    </div>
                </PlannerBootstrap>
            </GameDataProvider>
        </div>
    );
}
