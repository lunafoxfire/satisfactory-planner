import { OctagonAlert } from "lucide-react";
import { cn } from "#lib/utils";
import { useSolverStore } from "#lib/store/solver/store";
import type { SolveStatus } from "#lib/solver/solver";

interface ErrorDisplay {
    header: string,
    message: string,
}

function getErrorDisplay(status: Exclude<SolveStatus, "success">): ErrorDisplay {
    switch (status) {
        case "empty":
            return {
                header: "Solution Empty",
                message: "Your inputs generate an empty factory. Try setting some production targets.",
            };
        case "unbounded":
            return {
                header: "Unbounded Solution",
                message: "An infinite amount of products can be made. Don't forget that hand-gathered resources are considered infinite if enabled!",
            };
        case "infeasible":
            return {
                header: "No Solution",
                message: "No solution could be found. You probably need to enable more recipes, or there are not enough resources for your production targets.",
            };
        case "timeout":
            return {
                header: "Timeout",
                message: "Calculation timed out. Something really went wrong -- you should never see this.",
            };
        default:
            return {
                header: "Unknown Error",
                message: "Something went REALLY wrong. You should never see this.",
            };
    }
}

export interface ProductionErrorProps {
    className?: string;
}

export function ProductionError({ className }: ProductionErrorProps) {
    const status = useSolverStore((state) => state.result.status);

    if (status === "success") {
        return null;
    }

    const errorDisplay = getErrorDisplay(status);

    return (
        <div className={cn(
            "w-full h-full flex flex-col justify-center items-center gap-8 bg-background",
            className,
        )}>
            <span className="text-5xl">
                // {errorDisplay.header}
            </span>
            <OctagonAlert size={128} strokeWidth={1.2} className="text-primary" />
            <span className="max-w-lg">
                {errorDisplay.message}
            </span>
        </div>
    );
}
