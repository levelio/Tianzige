declare module "hanzi-writer" {
	export interface HanziWriter {
		animateCharacter(): void;
		hideCharacter(): void;
		quiz(options?: {
			onMistake?: () => void;
			onCorrectStroke?: () => void;
			onComplete?: () => void;
		}): void;
		ready(callback: () => void): void;
	}

	interface HanziWriterStatic {
		create(
			element: HTMLElement,
			character: string,
			options: {
				charDataLoader?: (
					char: string,
					callback: (data: unknown) => void,
				) => void;
				width?: number;
				height?: number;
				padding?: number;
				showOutline?: boolean;
				strokeAnimationSpeed?: number;
				delayBetweenStrokes?: number;
				strokeColor?: string;
				radicalColor?: string;
				outlineColor?: string;
				drawingWidth?: number;
				showCharacter?: boolean;
			},
		): HanziWriter;
	}

	const HanziWriter: HanziWriterStatic;
	export default HanziWriter;
}
