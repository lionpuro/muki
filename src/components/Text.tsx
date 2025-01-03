import Konva from "konva";
import { useRef } from "react";
import { Text as KonvaText } from "react-konva";
import { TextData } from "~/hooks/useShapes";

export const TextComponent = ({
	props,
	onSelect,
	onChange,
}: {
	props: TextData;
	onSelect: () => void;
	onChange: (p: TextData) => void;
}) => {
	const textRef = useRef<Konva.Text>(null);

	return (
		<KonvaText
			id={props.id}
			ref={textRef}
			draggable
			name="object"
			text={props.text}
			fill={props.fill}
			fontSize={props.fontSize}
			x={props.x}
			y={props.y}
			scaleX={props.scaleX}
			scaleY={props.scaleY}
			padding={6}
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
