import { useState } from "react";
import { Check, Link } from "lucide-react";
import { Button } from "#components/ui/button";
import { createSharedFactory } from "#api/shared-factory";
import { usePlannerStore } from "#lib/store/planner/store";
import { GAME_VERSION } from "#data/game-version";
import { cn } from "#lib/utils";

const COPIED_TIMEOUT = 2000;

export interface ShareButtonProps {
    className?: string;
}

export function ShareButton({ className }: ShareButtonProps) {
    const production = usePlannerStore((state) => state.production);
    const input = usePlannerStore((state) => state.input);
    const recipes = usePlannerStore((state) => state.recipes);

    const plannerState = {
        production,
        input,
        recipes,
    };

    const [isSharing, setIsSharing] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleShare = async () => {
        if (isSharing) {
            return;
        }

        setIsSharing(true);

        try {
            const { id } = await createSharedFactory({
                version: GAME_VERSION,
                data: plannerState,
            });

            const url = new URL(window.location.href);
            url.searchParams.set("share", id);

            await navigator.clipboard.writeText(url.toString());

            setIsCopied(true);
            window.setTimeout(() => setIsCopied(false), COPIED_TIMEOUT);
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <Button
            variant="outline"
            disabled={isSharing}
            onClick={handleShare}
            className={cn(className)}
        >
            {isCopied ? <Check /> : <Link />}
            {isCopied ? "Link copied" : "Share"}
        </Button>
    );
}
