export interface Env { }
import gameData from "./game-data/v1.2/gameData.json" with { type: "json" };

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        if (url.pathname === "/api/game-data") {
            return Response.json(gameData);
        }

        return new Response("Not Found", {
            status: 404,
        });
    },
};
