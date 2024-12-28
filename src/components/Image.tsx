import { KonvaEventObject } from "konva/lib/Node";
import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";

export type ImageAttributes = {
	id: string;
	src: string;
	width: number;
	height: number;
	x: number;
	y: number;
};

export const ImageComponent = ({
	src,
	attrs,
	onSelect,
	onChange,
}: {
	src: string;
	attrs: ImageAttributes;
	onSelect: (e: KonvaEventObject<MouseEvent | TouchEvent>) => void;
	onChange: (a: ImageAttributes) => void;
}) => {
	const [image] = useImage(src);

	return (
		<>
			<KonvaImage
				draggable
				name="object"
				image={image}
				width={attrs.width}
				height={attrs.height}
				x={attrs.x}
				y={attrs.y}
				onDragEnd={(e) => {
					onChange({
						...attrs,
						x: e.target.x(),
						y: e.target.y(),
					});
				}}
				onMouseDown={onSelect}
				onTap={onSelect}
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
		</>
	);
};

export default ImageComponent;
