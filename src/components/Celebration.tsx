import confetti from "canvas-confetti";
import { useEffect } from "react";

interface CelebrationProps {
	trigger: boolean;
	type?: "stars" | "confetti" | "fireworks";
	onComplete?: () => void;
}

export function Celebration({
	trigger,
	type = "confetti",
	onComplete,
}: CelebrationProps) {
	useEffect(() => {
		if (!trigger) return;

		const duration = 1000;
		const end = Date.now() + duration;
		let frameCount = 0;

		const animate = () => {
			const now = Date.now();
			const remaining = Math.max(0, end - now);

			// 每5帧发射一次，减少密度
			if (frameCount % 5 === 0) {
				if (type === "stars") {
					// 星星效果
					confetti({
						particleCount: 2,
						angle: 60,
						spread: 55,
						origin: { x: 0, y: 0.6 },
						colors: ["#58CC02", "#FFB800", "#FF9600"],
						shapes: ["star"],
					});
					confetti({
						particleCount: 2,
						angle: 120,
						spread: 55,
						origin: { x: 1, y: 0.6 },
						colors: ["#58CC02", "#FFB800", "#FF9600"],
						shapes: ["star"],
					});
				} else if (type === "fireworks") {
					// 烟花效果
					confetti({
						particleCount: 10,
						spread: 100,
						origin: { y: 0.6 },
						colors: ["#58CC02", "#FFB800", "#FF9600", "#FF6B6B"],
						gravity: 0.5,
						scalar: 1.2,
					});
				} else {
					// 彩带效果
					confetti({
						particleCount: 3,
						angle: 60,
						spread: 55,
						origin: { x: 0 },
						colors: ["#58CC02", "#FFB800", "#FF9600"],
					});
					confetti({
						particleCount: 3,
						angle: 120,
						spread: 55,
						origin: { x: 1 },
						colors: ["#58CC02", "#FFB800", "#FF9600"],
					});
				}
			}

			frameCount++;

			if (remaining > 0) {
				requestAnimationFrame(animate);
			} else {
				onComplete?.();
			}
		};

		animate();
	}, [trigger, type, onComplete]);

	return null;
}
