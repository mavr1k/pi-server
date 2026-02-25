import { type BunRequest, serve } from "bun";
import indexDev from "./index.html";
import { getStats } from "./lib/system";

const isProduction = process.env.NODE_ENV === "production";

// In production, read the built HTML from dist; in dev, use the source
const getIndexHtml = async () => {
	if (isProduction) {
		return async (req: BunRequest) => {
			const url = new URL(req.url);
			const filePath = url.pathname === "/" ? "/index.html" : url.pathname;
			const file = Bun.file("./dist" + filePath);
			return new Response(file);
		};
	}
	return indexDev;
};

const indexHtml = await getIndexHtml();

const server = serve({
	routes: {
		// Serve index.html for all unmatched routes.
		"/*": indexHtml,
		"/api/hello": {
			async GET(req) {
				return Response.json({
					message: "Hello, world!",
					method: "GET",
				});
			},
			async PUT(req) {
				return Response.json({
					message: "Hello, world!",
					method: "PUT",
				});
			},
		},
		"/api/hello/:name": async (req) => {
			const name = req.params.name;
			return Response.json({
				message: `Hello, ${name}!`,
			});
		},
		"/api/stats": async () => {
			const stats = await getStats();
			return Response.json(stats);
		},
	},

	development: !isProduction && {
		// Enable browser hot reloading in development
		hmr: true,

		// Echo console logs from the browser to the server
		console: true,
	},
});

console.log(`🚀 Server running at ${server.url}`);
