import { useState } from "react";
import type { FontVariant } from "~/components/FontPicker";

type BaseShape = {
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

export default function useShapes() {
	const [shapes, setShapes] = useState<ShapeData[]>([]);

	const findShape = (id: string) => shapes.find((sh) => sh.id === id);

	const createShape = <T extends ShapeData>(shape: T) => {
		switch (shape.type) {
			case "image":
				return {
					...shape,
					src: shape.src,
				} as ImageData;
			case "text":
				return {
					...shape,
					text: shape.text,
					fill: shape.fill || "#000000",
					fontSize: 280,
					fontStyle: shape.fontStyle,
					fontFamily: shape.fontFamily,
					align: "left",
					lineHeight: 1,
				} as TextData;
			default:
				return;
		}
	};

	const addShape = <T extends ShapeData>(shape: T) => {
		const newShape = createShape(shape);
		if (!newShape) return;
		setShapes([...shapes, newShape]);
	};

	const removeShape = (id: string) => {
		const result = shapes.filter((shape) => shape.id !== id);
		setShapes(result);
	};

	const updateShape = <T extends ShapeData>(props: T) => {
		const updated = shapes.map((shape) => {
			if (shape.id === props.id) {
				return { ...shape, ...props };
			}
			return shape;
		});
		setShapes(updated);
	};

	const clearShapes = () => setShapes([]);

	return {
		shapes,
		setShapes,
		findShape,
		createShape,
		addShape,
		removeShape,
		updateShape,
		clearShapes,
	};
}
