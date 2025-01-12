import Konva from "konva";
import { useEffect, useRef } from "react";
import { Text as KonvaText } from "react-konva";
import { TextData } from "~/hooks/useShapes";

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

	useEffect(() => {
		onLoad();
	}, [onLoad, props.fontStyle, props.align, props.lineHeight]);

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
