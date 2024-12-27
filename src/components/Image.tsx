import { useEffect, useRef } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";

export type ImageProps = {
	id: string;
	image: HTMLImageElement;
	x: number;
	y: number;
	width: number;
	height: number;
	rotation?: number;
};

const ImageComponent = ({
	imageProps,
	isSelected,
	onSelect,
	onChange,
}: {
	imageProps: ImageProps;
	isSelected: boolean;
	onSelect: () => void;
	onChange: (attrs: ImageProps) => void;
}) => {
	const imageRef: React.ComponentProps<typeof KonvaImage>["ref"] = useRef(null);
	const transformRef: React.ComponentProps<typeof Transformer>["ref"] =
		useRef(null);

	useEffect(() => {
		if (isSelected) {
			if (!transformRef.current || !imageRef.current) {
				return;
			}
			transformRef.current.nodes([imageRef.current]);
			transformRef.current.getLayer()?.batchDraw();
		}
	}, [isSelected]);

	return (
		<>
			<KonvaImage
				ref={imageRef}
				onClick={onSelect}
				onTap={onSelect}
				{...imageProps}
				draggable
				onDragStart={onSelect}
				onDragEnd={(e) => {
					onChange({
						...imageProps,
						x: e.target.x(),
						y: e.target.y(),
					});
				}}
				onTransformEnd={() => {
					if (!imageRef.current) return;
					const node = imageRef.current;
					const scaleX = node.scaleX();
					const scaleY = node.scaleY();

					node.scaleX(1);
					node.scaleY(1);
					onChange({
						...imageProps,
						x: node.x(),
						y: node.y(),
						width: Math.max(5, node.width() * scaleX),
						height: Math.max(node.height() * scaleY),
					});
				}}
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
			{isSelected && (
				<Transformer
					ref={transformRef}
					rotateEnabled={false}
					borderStroke={"#3b82f6"}
					borderStrokeWidth={2}
				/>
			)}
		</>
	);
};

export default ImageComponent;
