import { useStore } from "@tanstack/react-store";
import { RotateCcw } from "lucide-react";
import { hanziStore } from "@/stores/hanziStore";

interface ControlButtonsProps {
	onReplay?: () => void;
}

export function ControlButtons({ onReplay }: ControlButtonsProps) {
	const mode = useStore(hanziStore, (s) => s.mode);

	const buttonText = mode === "watch" ? "重播" : "重新开始";

	return (
		<div className="flex gap-4">
			<button
				type="button"
				onClick={onReplay}
				className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors shadow-lg"
			>
				<RotateCcw className="w-5 h-5" />
				{buttonText}
			</button>
		</div>
	);
}
