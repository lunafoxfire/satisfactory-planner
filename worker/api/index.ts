import { Hono } from "hono";
import gameData from "./game-data.ts";
import sharedFactories from "./shared-factories.ts";

const app = new Hono();

app.route("/api/game-data", gameData);
app.route("/api/shared-factories", sharedFactories);

export default app;
