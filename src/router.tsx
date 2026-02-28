import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { createHashHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// 使用 hash 路由模式，适配 GitHub Pages 子目录部署
const hashHistory = createHashHistory();

export function getRouter() {
	const router = createTanStackRouter({
		routeTree,
		history: hashHistory,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
