import { useState } from "react";
import { ControlPanelContainer } from "#components/control-panel/control-panel-container";
import { ReportsPanelContainer } from "#components/reports-panel/reports-panel-container";

export function AppWorkspace() {
    const [inputsOpen, setInputsOpen] = useState(true);
    const [reportOpen, setReportOpen] = useState(true);

    return (
        <div
            className={[
                "grid h-svh overflow-hidden",
                inputsOpen && reportOpen && "grid-cols-[20rem_minmax(0,1fr)_20rem]",
                inputsOpen && !reportOpen && "grid-cols-[20rem_minmax(0,1fr)_0]",
                !inputsOpen && reportOpen && "grid-cols-[0_minmax(0,1fr)_20rem]",
                !inputsOpen && !reportOpen && "grid-cols-[0_minmax(0,1fr)_0]",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <ControlPanelContainer
                open={inputsOpen}
                onOpenChange={setInputsOpen}
            />

            <main className="min-w-0 overflow-hidden">
            </main>

            <ReportsPanelContainer
                open={reportOpen}
                onOpenChange={setReportOpen}
            />
        </div>
    );
}
