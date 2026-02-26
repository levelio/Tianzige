import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { Book, Pencil, Target } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Celebration } from "@/components/Celebration";
import { ControlButtons } from "@/components/ControlButtons";
import type { HanziCanvasHandle } from "@/components/HanziCanvas";
import { HanziCanvas } from "@/components/HanziCanvas";
import { ModeSwitcher } from "@/components/ModeSwitcher";
import { NavigationButtons } from "@/components/NavigationButtons";
import { hanziStore } from "@/stores/hanziStore";

export const Route = createFileRoute("/")({
	component: IndexPage,
});

function IndexPage() {
	const navigate = useNavigate();
	const characters = useStore(hanziStore, (s) => s.characters);
	const currentIndex = useStore(hanziStore, (s) => s.currentIndex);
	const [celebrationTrigger, setCelebrationTrigger] = useState(false);
	const hanziCanvasRef = useRef<HanziCanvasHandle>(null);

	const currentCharacter = characters[currentIndex] || "";

	const handleComplete = useCallback(() => {
		setCelebrationTrigger(true);
		setTimeout(() => setCelebrationTrigger(false), 1000);
	}, []);

	const handleReplay = useCallback(() => {
		hanziCanvasRef.current?.replay();
	}, []);

	const handleSelectPreset = useCallback(() => {
		navigate({ to: "/presets" });
	}, [navigate]);

	const handleCustom = useCallback(() => {
		navigate({ to: "/custom" });
	}, [navigate]);

	// 如果没有汉字，显示欢迎页
	if (!currentCharacter) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 flex flex-col items-center justify-center p-4">
				<div className="text-center max-w-md">
					<h1 className="text-4xl font-black text-gray-800 mb-2 flex items-center justify-center gap-2">
						<Target className="w-10 h-10 text-emerald-500" />
						天天识字
					</h1>
					<p className="text-lg text-gray-600 mb-8">快乐学习汉字书写</p>

					<div className="space-y-4">
						<button
							type="button"
							onClick={handleSelectPreset}
							className="w-full px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg transition-colors shadow-lg flex items-center justify-center gap-2"
						>
							<Book className="w-5 h-5" />
							选择汉字集
						</button>

						<button
							type="button"
							onClick={handleCustom}
							className="w-full px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-lg transition-colors shadow-lg flex items-center justify-center gap-2"
						>
							<Pencil className="w-5 h-5" />
							自定义汉字
						</button>
					</div>

					<div className="mt-8 p-6 bg-white rounded-3xl shadow-lg">
						<p className="text-gray-600 text-sm">专为 3-5 岁儿童设计</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 flex flex-col">
			{/* 顶部导航 */}
			<header className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm">
				<h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
					<Target className="w-6 h-6 text-emerald-500" />
					天天识字
				</h1>
				<button
					type="button"
					onClick={() =>
						hanziStore.setState((s) => ({
							...s,
							characters: [],
							currentIndex: -1,
						}))
					}
					className="text-gray-500 hover:text-gray-700"
				>
					返回首页
				</button>
			</header>

			{/* 主内容区 */}
			<main className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
				{/* 导航按钮 */}
				<NavigationButtons />

				{/* 汉字画布 */}
				<HanziCanvas
					ref={hanziCanvasRef}
					character={currentCharacter}
					onComplete={handleComplete}
				/>

				{/* 模式切换 */}
				<ModeSwitcher />

				{/* 控制按钮 */}
				<ControlButtons onReplay={handleReplay} />
			</main>

			{/* 庆祝动画 */}
			<Celebration trigger={celebrationTrigger} type="stars" />

			{/* 底部导航 */}
			<nav className="flex justify-center gap-4 p-4 bg-white/80 backdrop-blur-sm">
				<button
					type="button"
					onClick={handleSelectPreset}
					className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-800"
				>
					<Book className="w-6 h-6" />
					<span className="text-xs">汉字集</span>
				</button>
				<button
					type="button"
					onClick={handleCustom}
					className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-800"
				>
					<Pencil className="w-6 h-6" />
					<span className="text-xs">自定义</span>
				</button>
			</nav>
		</div>
	);
}
