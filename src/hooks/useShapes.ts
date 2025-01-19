import { nanoid } from "nanoid";
import { useState } from "react";
import { resolution } from "~/constants";
import {
	TextData,
	ImageData,
	SelectedShape,
	ShapeType,
	ShapeData,
} from "~/editor/shapes";

export type Shapes = {
	images: ImageData[];
	texts: TextData[];
};

const initialShapes: Shapes = {
	images: [],
	texts: [],
};

const fitImage = (img: HTMLImageElement) => {
	const ratio = Math.min(
		resolution.width / img.width,
		resolution.height / img.height,
	);
	if (img.height > resolution.height || img.width > resolution.width) {
		return { width: img.width * ratio, height: img.height * ratio };
	}
	return { width: img.width, height: img.height };
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

export default function useShapes() {
	const [shapes, setShapes] = useState<Shapes>(initialShapes);

	const findShape = (shape: SelectedShape) => {
		switch (shape.type) {
			case "image":
				return shapes.images.find((sh) => sh.id === shape.id);
			case "text":
				return shapes.texts.find((sh) => sh.id === shape.id);
			default:
				return undefined;
		}
	};

	const addImage = (img: ImageData) => {
		setShapes({ ...shapes, images: [...shapes.images, img] });
	};

	const addText = (text: TextData) => {
		setShapes({ ...shapes, texts: [...shapes.texts, text] });
	};

	const shapeKey = (type: ShapeType): keyof Shapes => {
		switch (type) {
			case "image":
				return "images";
			case "text":
				return "texts";
		}
	};

	const removeShape = (shape: SelectedShape) => {
		const key = shapeKey(shape.type);
		const result = shapes[key].filter((sh) => sh.id !== shape.id);
		setShapes({ ...shapes, [key]: result });
	};

	const updateShape = <T extends ShapeData>(props: T) => {
		const key = shapeKey(props.type);
		const updated = shapes[key].map((shape) => {
			if (shape.id === props.id) {
				return { ...shape, ...props };
			}
			return shape;
		});
		setShapes({ ...shapes, [key]: updated });
	};

	const clearShapes = () => setShapes(initialShapes);

	return {
		shapes,
		setShapes,
		findShape,
		addImage,
		addText,
		removeShape,
		updateShape,
		clearShapes,
	};
}
