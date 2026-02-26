import { Store } from "@tanstack/store";

export interface HanziState {
	// 当前汉字列表
	characters: string[];
	// 当前索引 (当字符列表为空时为 -1)
	currentIndex: number;
	// 当前模式：'watch' | 'practice'
	mode: "watch" | "practice";
	// 是否加载中
	isLoading: boolean;
}

export const hanziStore = new Store<HanziState>({
	characters: [],
	currentIndex: -1,
	mode: "watch",
	isLoading: false,
});

export const setCharacters = (chars: string[]) => {
	hanziStore.setState((state) => ({
		...state,
		characters: chars,
		currentIndex: chars.length > 0 ? 0 : -1,
	}));
};

export const nextCharacter = () => {
	hanziStore.setState((state) => {
		if (state.currentIndex < state.characters.length - 1) {
			return { ...state, currentIndex: state.currentIndex + 1 };
		}
		return state;
	});
};

export const previousCharacter = () => {
	hanziStore.setState((state) => {
		if (state.currentIndex > 0) {
			return { ...state, currentIndex: state.currentIndex - 1 };
		}
		return state;
	});
};

export const setMode = (mode: "watch" | "practice") => {
	hanziStore.setState((state) => ({ ...state, mode }));
};

export const setLoading = (loading: boolean) => {
	hanziStore.setState((state) => ({ ...state, isLoading: loading }));
};
