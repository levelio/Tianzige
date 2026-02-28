import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";
import "../styles.css";

export const Route = createRootRoute({
	component: RootComponent,
	notFoundComponent: NotFound,
});

function RootComponent() {
	return (
		<>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	);
}

function NotFound() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 flex flex-col items-center justify-center p-4">
			<div className="text-center max-w-md">
				<h1 className="text-6xl font-black text-gray-800 mb-4">404</h1>
				<p className="text-xl text-gray-600 mb-8">页面未找到</p>
				<Link
					to="/"
					className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors shadow-lg"
				>
					<Home className="w-5 h-5" />
					返回首页
				</Link>
			</div>
		</div>
	);
}
