import { usePlannerStore } from "#lib/store/planner/store";
import { useEffect } from "react";

export function UpdateDocumentTitle() {
    const factoryName = usePlannerStore(
        (state) => state.production.factoryName,
    );

    useEffect(() => {
        document.title = `${factoryName} - Satisfactory Planner`;
    }, [factoryName]);

    return null;
}
