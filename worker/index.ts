export interface Env {}

const gameData = {
    version: "1.2",
    items: {},
    recipes: {},
    buildings: {},
    resources: {},
}

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
