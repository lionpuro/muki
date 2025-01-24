import { FontVariant } from "~/controls/font-picker";
import { ImageComponent } from "./image";
import { TextComponent } from "./text";
import { nanoid } from "nanoid";
import { resolution } from "~/constants";

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

export type Shapes = {
	images: ImageData[];
	texts: TextData[];
};

export type ShapeType = BaseShape["type"];

export type SelectedShape = {
	id: string;
	type: ShapeType;
};

const fitImage = (img: HTMLImageElement) => {
	const ratio = Math.min(
		resolution.width / img.width,
		resolution.height / img.height,
	);
	return { width: img.width * ratio, height: img.height * ratio };
};

export const createImage = (img: HTMLImageElement): ImageData => {
	const { width, height } = fitImage(img);
	return {
		type: "image",
		id: nanoid(),
		width: width,
		height: height,
		x: (resolution.width - width) / 2,
		y: (resolution.height - height) / 2,
		src: img.src,
	};
};

export const createText = (text: string): TextData => {
	return {
		type: "text",
		id: nanoid(),
		width: 800,
		height: 400,
		scaleX: 1,
		scaleY: 1,
		x: Math.floor(Math.random() * 500),
		y: Math.floor(Math.random() * 200),
		fill: "#000000",
		text: text,
		fontSize: 280,
		fontStyle: "normal",
		fontFamily: "Nunito",
		align: "left",
		lineHeight: 1,
	};
};
