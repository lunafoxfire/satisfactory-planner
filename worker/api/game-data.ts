import { Hono } from "hono";
import gameData from "../game-data/v1.2/gameData.json" with { type: "json" };

const app = new Hono();

app.get("/", (c) => {
    return c.json(gameData);
});

export default app;
