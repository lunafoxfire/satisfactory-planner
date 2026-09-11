import { z } from "zod";
import { type SharedFactory, SharedFactorySchema } from "#data/shared-factory-schema";

const SharedFactoryResponseSchema = z.object({
    id: z.string(),
});

export async function createSharedFactory(sharedFactory: SharedFactory) {
    const response = await fetch("/api/shared-factories", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(sharedFactory),
    });

    if (!response.ok) {
        throw new Error(`Failed to create shared factory: ${response.status}`);
    }

    return SharedFactoryResponseSchema.parse(await response.json());
}

export async function getSharedFactory(id: string) {
    const response = await fetch(`/api/shared-factories/${encodeURIComponent(id)}`);

    if (!response.ok) {
        throw new Error(`Failed to load shared factory: ${response.status}`);
    }

    return SharedFactorySchema.parse(await response.json());
}
