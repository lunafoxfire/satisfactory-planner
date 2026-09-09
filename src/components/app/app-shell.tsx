import { GameDataProvider } from "#providers/game-data-provider";
import { AppHeader } from "./app-header";
import { AppWorkspace } from "./app-workspace";

export function AppShell() {
    return (
        <div className="flex h-svh flex-col">
            <GameDataProvider>
                <AppHeader />

                <div className="min-h-0 flex-1">
                    <AppWorkspace />
                </div>
            </GameDataProvider>
        </div>
    );
}
