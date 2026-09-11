import { Hono } from "hono";
import { validator } from "hono/validator";
import { bodyLimit } from "hono/body-limit";
import { SharedFactorySchema } from "#data/shared-factory-schema";

const app = new Hono<{ Bindings: Env; }>();

const MAX_SHARED_FACTORY_SIZE = 24 * 1024;

function generateShareId(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(10));
    return btoa(String.fromCharCode(...bytes))
        .replaceAll("+", "-")
        .replaceAll("/", "_")
        .replaceAll("=", "");
}

app.post(
    "/",
    async (c, next) => {
        const ip = c.req.header("CF-Connecting-IP") ?? "unknown";
        const { success } = await c.env.SHARE_CREATE_RATE_LIMIT.limit({
            key: `share:create:${ip}`,
        });

        if (!success) {
            return c.json({ error: "Too many requests" }, 429);
        }

        await next();
    },
    bodyLimit({
        maxSize: MAX_SHARED_FACTORY_SIZE,
        onError: (c) => {
            return c.json({ error: "Shared factory is too large" }, 413);
        },
    }),
    validator("json", (value, c) => {
        const result = SharedFactorySchema.safeParse(value);

        if (!result.success) {
            return c.json(
                {
                    error: "Invalid shared factory",
                    issues: result.error.issues,
                },
                400,
            );
        }

        return result.data;
    }),
    async (c) => {
        const factory = c.req.valid("json");
        const id = generateShareId();
        const now = Date.now();

        await c.env.DB
            .prepare(
                `INSERT INTO shared_factories (id, state, created_at, last_viewed_at)
                 VALUES (?, ?, ?, ?)`,
            )
            .bind(id, JSON.stringify(factory), now, now)
            .run();

        return c.json({ id }, 201);
    },
);

app.get("/:id", async (c) => {
    const id = c.req.param("id");

    const row = await c.env.DB
        .prepare(
            `SELECT state
             FROM shared_factories
             WHERE id = ?`,
        )
        .bind(id)
        .first<{ state: string; }>();

    if (!row) {
        return c.json({ error: "Shared factory not found" }, 404);
    }

    const result = SharedFactorySchema.safeParse(JSON.parse(row.state));

    if (!result.success) {
        return c.json({ error: "Invalid stored shared factory" }, 500);
    }

    await c.env.DB
        .prepare(
            `UPDATE shared_factories
             SET last_viewed_at = ?
             WHERE id = ?`,
        )
        .bind(Date.now(), id)
        .run();

    return c.json(result.data);
});

export default app;
