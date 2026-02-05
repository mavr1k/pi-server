import { getStats } from "./lib/system.ts"; 
const { serve, file } = Bun;

const server = serve({
  routes: {
    "/api/status": new Response("OK"),
    "/users/:id": req => {
      return new Response(`Hello User ${req.params.id}!`);
    },
    "/api/posts": {
      GET: () => new Response("List posts"),
      POST: async req => {
        const body = await req.json();
        return Response.json({ created: true, ...body });
      },
    },
    "/api/stats": async () => {
      const stats = await getStats();
      return Response.json(stats);
    },
    "/blog/hello": Response.redirect("/blog/hello/world"),
    "/": file("./public/index.html"),
    "/favicon.ico": file("./favicon.ico"),
  },
  fetch: () => Response.json({ message: "Not Found" }, { status: 404 }),
});

console.log(`Server running at ${server.url}`);
