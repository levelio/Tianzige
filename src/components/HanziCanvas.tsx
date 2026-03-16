import { useStore } from "@tanstack/react-store";
import HanziWriter from "hanzi-writer";
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { hanziStore } from "@/stores/hanziStore";

export interface HanziCanvasHandle {
	animateCharacter: () => void;
	replay: () => void;
}

interface HanziCanvasProps {
	character: string;
	onComplete?: () => void;
	onStrokeChange?: (isCorrect: boolean) => void;
}

// CDN 备份列表，按优先级排序
const CDN_URLS = [
	"https://unpkg.com/hanzi-writer-data@2.0/",
	"https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/",
];

// 尝试从多个 CDN 加载数据
async function fetchCharacterData(char: string): Promise<unknown> {
	for (const url of CDN_URLS) {
		try {
			const response = await fetch(`${url}${char}.json`, { signal: AbortSignal.timeout(5000) });
			if (response.ok) {
				return await response.json();
			}
		} catch {
			// 尝试下一个 CDN
			continue;
		}
	}
	throw new Error(`Failed to load character data for: ${char}`);
}

export const HanziCanvas = forwardRef<HanziCanvasHandle, HanziCanvasProps>(
	({ character, onComplete, onStrokeChange }, ref) => {
		const containerRef = useRef<HTMLDivElement>(null);
		const writerRef = useRef<ReturnType<typeof HanziWriter.create> | null>(null);
		const mode = useStore(hanziStore, (s) => s.mode);
		const [charData, setCharData] = useState<unknown | null>(null);
		const abortControllerRef = useRef<AbortController | null>(null);
		const currentCharacterRef = useRef<string>("");
		const [isCompleted, setIsCompleted] = useState(false);

		// 暴露方法给父组件
		useImperativeHandle(
			ref,
			() => ({
				animateCharacter: () => {
					if (writerRef.current) {
						setIsCompleted(false);
						writerRef.current.hideCharacter();
						setTimeout(() => {
							writerRef.current?.animateCharacter();
						}, 50);
					}
				},
				replay: () => {
					if (writerRef.current) {
						setIsCompleted(false);
						writerRef.current.hideCharacter();
						setTimeout(() => {
							if (writerRef.current) {
								if (mode === "watch") {
									writerRef.current.animateCharacter();
								} else {
									writerRef.current.quiz({
										onMistake: () => {
											onStrokeChange?.(false);
										},
										onCorrectStroke: () => {
											onStrokeChange?.(true);
										},
										onComplete: () => {
											setIsCompleted(true);
											writerRef.current?.showCharacter();
											onComplete?.();
										},
									});
								}
							}
						}, 50);
					}
				},
			}),
			[mode, onStrokeChange, onComplete],
		);

		// 加载字符数据
		useEffect(() => {
			// 取消之前的请求
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			// 如果是相同的字符，不重复加载
			if (character === currentCharacterRef.current && charData) {
				return;
			}

			setCharData(null);
			setIsCompleted(false);
			currentCharacterRef.current = character;

			const controller = new AbortController();
			abortControllerRef.current = controller;

			fetchCharacterData(character)
				.then((data) => {
					// 检查是否已被取消或字符已变化
					if (
						controller.signal.aborted ||
						character !== currentCharacterRef.current
					)
						return;

					setCharData(data);
				})
				.catch((err) => {
					// 如果是主动取消，不报错
					if (err.name !== "AbortError") {
						console.error("Failed to load character data:", err);
					}
				});

			return () => {
				abortControllerRef.current = null;
			};
		}, [character]);

		// 创建 writer
		useEffect(() => {
			if (
				!containerRef.current ||
				!charData ||
				character !== currentCharacterRef.current
			)
				return;

			// 清空容器
			containerRef.current.innerHTML = "";

			const writer = HanziWriter.create(containerRef.current, character, {
				charDataLoader: (_char, onLoad) => {
					onLoad(charData);
				},
				width: 300,
				height: 300,
				padding: 20,
				showOutline: true,
				strokeAnimationSpeed: 1,
				delayBetweenStrokes: 200,
				strokeColor: "#58CC02",
				radicalColor: "#FF9600",
				outlineColor: "#DDDDDD",
				drawingWidth: 20,
				showCharacter: false,
			});

			writerRef.current = writer;

			// 延迟执行模式操作，确保 DOM 渲染完成
			const timeoutId = setTimeout(() => {
				if (
					!writerRef.current ||
					character !== currentCharacterRef.current
				)
					return;

				if (mode === "watch") {
					writerRef.current.animateCharacter();
				} else {
					writerRef.current.quiz({
						onMistake: () => {
							onStrokeChange?.(false);
						},
						onCorrectStroke: () => {
							onStrokeChange?.(true);
						},
						onComplete: () => {
							setIsCompleted(true);
							writerRef.current?.showCharacter();
							onComplete?.();
						},
					});
				}
			}, 100);

			return () => {
				clearTimeout(timeoutId);
				writerRef.current = null;
			};
		}, [character, charData, mode]);

		return (
			<div className="flex items-center justify-center">
				<div
					className="relative rounded-3xl shadow-lg overflow-hidden bg-white"
					style={{ width: 300, height: 300 }}
				>
					{/* 田字格背景 */}
					<svg
						className="absolute inset-0 w-full h-full pointer-events-none"
						viewBox="0 0 300 300"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>田字格</title>
						{/* 外框，rx 与容器 rounded-3xl (24px) 保持一致 */}
						<rect
							x="1" y="1" width="298" height="298"
							fill="none"
							stroke="#F4A8A0"
							strokeWidth="2"
							rx="24"
						/>
						{/* 竖中线（虚线） */}
						<line
							x1="150" y1="1" x2="150" y2="299"
							stroke="#F4A8A0"
							strokeWidth="1"
							strokeDasharray="8,5"
						/>
						{/* 横中线（虚线） */}
						<line
							x1="1" y1="150" x2="299" y2="150"
							stroke="#F4A8A0"
							strokeWidth="1"
							strokeDasharray="8,5"
						/>
					</svg>

					{/* HanziWriter 挂载容器，背景透明以透出田字格 */}
					<div
						ref={containerRef}
						className="absolute inset-0"
						style={{ width: 300, height: 300 }}
					/>
				</div>
			</div>
		);
	},
);

HanziCanvas.displayName = "HanziCanvas";
