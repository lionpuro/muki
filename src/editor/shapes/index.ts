import { FontVariant } from "~/controls/font-picker";
import { ImageComponent } from "./image";
import { TextComponent } from "./text";
export { ImageComponent, TextComponent };

export type BaseShape = {
	type: "image" | "text";
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	scaleX?: number;
	scaleY?: number;
};

export type ShapeData = BaseShape & Record<string, string | number>;

export type ImageData = BaseShape & {
	src: string;
};
export type TextData = BaseShape & {
	text: string;
	fill: string;
	fontSize: number;
	fontStyle: FontVariant;
	fontFamily: string;
	align: "left" | "center" | "right";
	lineHeight: number;
};

export type ShapeType = BaseShape["type"];

export type SelectedShape = {
	id: string;
	type: ShapeType;
};
