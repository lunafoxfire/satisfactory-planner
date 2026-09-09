import { ReportsPanel } from "#components/reports-panel/reports-panel";
import { ControlPanel } from "#components/control-panel/control-panel";
import { ProductionGraphContainer } from "#components/production-graph/production-graph-container";

export function AppWorkspace() {
    return (
        <div className="relative h-svh overflow-hidden">
            <main className="h-full min-w-0">
                <ProductionGraphContainer />
            </main>

            <ControlPanel />

            <ReportsPanel />
        </div>
    );
}
