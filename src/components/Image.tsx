import { KonvaEventObject } from "konva/lib/Node";
import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { ImageData } from "~/hooks/useShapes";

export const ImageComponent = ({
	props,
	onSelect,
	onChange,
}: {
	props: ImageData;
	onSelect: (e: KonvaEventObject<MouseEvent | TouchEvent>) => void;
	onChange: (a: ImageData) => void;
}) => {
	const [image] = useImage(props.src);

	return (
		<KonvaImage
			id={props.id}
			draggable
			name="object"
			image={image}
			width={props.width}
			height={props.height}
			x={props.x}
			y={props.y}
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

export default ImageComponent;
