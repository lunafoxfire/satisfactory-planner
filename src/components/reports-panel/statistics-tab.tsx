import { TempDebugInfo } from "#components/temp-debug-info";
import { SectionCard } from "#components/section-card";

export function StatisticsTab() {
    return (
        <div className="flex h-full min-h-0 flex-col">
            <SectionCard title="Statistics">
                <TempDebugInfo />
            </SectionCard>
        </div>
    );
}
