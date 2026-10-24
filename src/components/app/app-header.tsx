import { ShareButton } from "#components/share-button";
import { Button } from "#components/ui/button";
import { ExternalLink } from "lucide-react";

export function AppHeader() {
    const openNewTab = () => {
        window.open(
            new URL("/", window.location.origin).toString(),
            "_blank",
            "noopener,noreferrer",
        );
    };

    return (
        <header className="flex justify-between h-14 shrink-0 items-center border-b px-2">
            <h1 className="text-lg font-semibold uppercase">// ++++ Simple Satisfactory Planner ++++ //</h1>
            <div className="flex gap-2">
                <Button
                    onClick={() => { openNewTab(); }}
                >
                    <ExternalLink />
                    New Factory
                </Button>
                <ShareButton className="" />
            </div>
        </header>
    );
}
