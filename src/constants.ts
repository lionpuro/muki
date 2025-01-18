import type { Font } from "~/controls/font-picker";

export const margin = 32;
export const resolution = { width: 2835, height: 1181 };
export const aspectRatio = resolution.height / resolution.width;

export const snap_threshold = 5;
export const snap_line_style = {
	stroke: "#71abea",
	strokeWidth: 2,
	name: "guid-line",
	dash: [4, 6],
};

export const fonts: Font[] = [
	{
		family: "Nunito",
		urlName: "nunito",
		variants: ["normal", "italic", "bold", "italic bold"],
	},
	{
		family: "Prompt",
		urlName: "prompt",
		variants: ["normal", "italic", "bold", "italic bold"],
	},
	{
		family: "Bebas Neue",
		urlName: "bebas-neue",
		variants: ["normal"],
	},
	{
		family: "Inter",
		urlName: "inter",
		variants: ["normal", "italic", "bold", "italic bold"],
	},
];
