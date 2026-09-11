import { useEffect, useState, type PropsWithChildren } from "react";
import { getSharedFactory } from "#api/shared-factory";
import { usePlannerStore } from "#lib/store/planner/store";

export function PlannerBootstrap({ children }: PropsWithChildren) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function initialize() {
            if (!usePlannerStore.persist.hasHydrated()) {
                await new Promise<void>((resolve) => {
                    const unsubscribe = usePlannerStore.persist.onFinishHydration(
                        () => {
                            unsubscribe();
                            resolve();
                        },
                    );
                });
            }

            const shareId = new URLSearchParams(window.location.search).get("share");
            if (shareId) {
                try {
                    const sharedFactory = await getSharedFactory(shareId);
                    if (!cancelled) {
                        usePlannerStore.setState(sharedFactory.data);
                    }
                } catch (error) {
                    console.error(error);
                }
            }

            if (!cancelled) {
                setReady(true);
            }
        }

        initialize();

        return () => {
            cancelled = true;
        };
    }, []);

    if (!ready) {
        return <div>Loading saved factory...</div>;
    }

    return children;
}
