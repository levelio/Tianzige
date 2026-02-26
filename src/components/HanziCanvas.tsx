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

const SVG_URL = "https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/";

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

			fetch(`${SVG_URL}${character}.json`, { signal: controller.signal })
				.then((res) => res.json())
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
					ref={containerRef}
					className="bg-white rounded-3xl shadow-lg relative overflow-hidden"
					style={{ width: 300, height: 300 }}
				/>
			</div>
		);
	},
);

HanziCanvas.displayName = "HanziCanvas";
