export interface HanziPreset {
	id: string;
	name: string;
	icon: string;
	characters: string[];
}

export const presets: HanziPreset[] = [
	{
		id: "basic",
		name: "基础字",
		icon: "🔤",
		characters: ["一", "二", "三", "人", "大", "小", "上", "下"],
	},
	{
		id: "nature",
		name: "大自然",
		icon: "🌳",
		characters: ["山", "水", "火", "日", "月", "云", "雨", "雪"],
	},
	{
		id: "animals",
		name: "小动物",
		icon: "🐱",
		characters: ["马", "牛", "羊", "鸟", "鱼", "虫", "犬"],
	},
];

export const getPresetById = (id: string): HanziPreset | undefined => {
	return presets.find((p) => p.id === id);
};
