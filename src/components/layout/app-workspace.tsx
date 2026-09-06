import { useState } from "react";
import { InputsPanel } from "./inputs-panel";
import { ReportsPanel } from "./reports-panel";
import { MainBody } from "./main-body";

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
            <InputsPanel
                open={inputsOpen}
                onOpenChange={setInputsOpen}
            />

            <main className="min-w-0 overflow-hidden">
                <MainBody />
            </main>

            <ReportsPanel
                open={reportOpen}
                onOpenChange={setReportOpen}
            />
        </div>
    );
}
