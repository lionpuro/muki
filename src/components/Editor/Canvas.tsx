import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Dispatch, SetStateAction, useRef } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import ImageComponent, { ImageAttributes } from "~/components/Image";

export type Resolution = {
	width: number;
	height: number;
};

type ClickEvent = KonvaEventObject<MouseEvent | TouchEvent>;

const Canvas = ({
	size,
	scale,
	images,
	setImages,
	selectedImage,
	selectImage,
}: {
	size: Resolution;
	scale: number;
	images: ImageAttributes[];
	setImages: (imgs: ImageAttributes[]) => void;
	selectedImage: string | null;
	selectImage: Dispatch<SetStateAction<string | null>>;
}) => {
	const stageRef = useRef<Konva.Stage>(null);
	const trRef = useRef<Konva.Transformer>(null);

	const deselect = (e: ClickEvent) => {
		if (e.target === stageRef.current) {
			trRef.current?.nodes([]);
			selectImage(null);
		}
	};

	const onDragMove = () => {
		const target = trRef.current;
		if (!target) return;
		const [selectedNode] = target.getNodes();

		if (!selectedNode) return;

		const orgAbsPos = target.absolutePosition();
		const absPos = target.absolutePosition();

		const vecDiff = {
			x: orgAbsPos.x - absPos.x,
			y: orgAbsPos.y - absPos.y,
		};

		const nodeAbsPos = selectedNode.getAbsolutePosition();

		const newPos = {
			x: nodeAbsPos.x - vecDiff.x,
			y: nodeAbsPos.y - vecDiff.y,
		};

		selectedNode.setAbsolutePosition(newPos);
	};

	return (
		<div className="bg-zinc-800 rounded">
			<Stage
				ref={stageRef}
				width={size.width}
				height={size.height}
				scaleX={scale}
				scaleY={scale}
				onMouseDown={deselect}
				onTouchStart={deselect}
			>
				<Layer>
					{images.map((img) => (
						<ImageComponent
							key={img.id}
							src={img.src}
							attrs={{ ...img }}
							onSelect={(e) => {
								trRef.current?.nodes([e.currentTarget]);
								selectImage(img.id);
							}}
							onChange={(attrs) =>
								setImages(
									images.map((i) => {
										if (i.id === selectedImage) {
											return { ...i, ...attrs };
										}
										return i;
									}),
								)
							}
						/>
					))}
					<Transformer
						ref={trRef}
						onDragMove={onDragMove}
						rotateEnabled={false}
						borderStroke={"#3b82f6"}
						borderStrokeWidth={2}
					/>
				</Layer>
			</Stage>
		</div>
	);
};
export default Canvas;
