import Konva from "konva";
import useFontObserver, { FontFace } from "~/hooks/useFontObserver";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Text as KonvaText } from "react-konva";
import { TextData } from "~/hooks/useShapes";
import type { FontVariant } from "~/controls/font-picker";

function getFontFace(family: string, variant: FontVariant): FontFace {
	switch (variant) {
		case "italic bold":
			return {
				family: family,
				style: "italic",
				weight: "700",
			};
		case "italic":
			return {
				family: family,
				style: "italic",
				weight: "400",
			};
		case "bold":
			return {
				family: family,
				style: "normal",
				weight: "700",
			};
		default:
			return {
				family: family,
				style: "normal",
				weight: "400",
			};
	}
}

export const TextComponent = ({
	props,
	onSelect,
	onChange,
	onLoad,
}: {
	props: TextData;
	onSelect: () => void;
	onChange: (p: TextData) => void;
	onLoad: () => void;
}) => {
	const textRef = useRef<Konva.Text>(null);

	const fontFace = useMemo(() => {
		return getFontFace(props.fontFamily, props.fontStyle);
	}, [props.fontFamily, props.fontStyle]);

	const onFontLoad = useCallback(() => {
		textRef.current?.getStage()?.draw();
		onLoad();
	}, [onLoad]);

	useFontObserver([fontFace], onFontLoad);

	useEffect(() => {
		onLoad();
	}, [onLoad, props.fill, props.align, props.lineHeight]);

	useEffect(() => {
		return () => onLoad();
	}, [onLoad]);

	return (
		<KonvaText
			id={props.id}
			ref={textRef}
			draggable
			name="object"
			text={props.text}
			fill={props.fill}
			fontSize={props.fontSize}
			fontStyle={props.fontStyle}
			fontFamily={props.fontFamily}
			align={props.align}
			lineHeight={props.lineHeight}
			x={props.x}
			y={props.y}
			scaleX={props.scaleX}
			scaleY={props.scaleY}
			padding={64}
			onDragEnd={(e) => {
				onChange({
					...props,
					x: e.target.x(),
					y: e.target.y(),
				});
			}}
			onMouseDown={onSelect}
			onTouchStart={onSelect}
			onMouseEnter={(e) => {
				const container = e.target.getStage()?.container();
				if (container) {
					container.style.cursor = "pointer";
				}
			}}
			onMouseLeave={(e) => {
				const container = e.target.getStage()?.container();
				if (container) {
					container.style.cursor = "default";
				}
			}}
		/>
	);
};
