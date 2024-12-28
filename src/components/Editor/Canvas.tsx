import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import ImageComponent, { ImageAttributes } from "~/components/Image";
import Transformer, { SnapLines } from "~/components/Editor/Transformer";

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

	const [snapLines, setSnapLines] = useState<SnapLines>({
		horizontal: [],
		vertical: [],
	});

	const deselect = (e: ClickEvent) => {
		if (e.target === stageRef.current) {
			trRef.current?.nodes([]);
			selectImage(null);
		}
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
						stageRef={stageRef}
						trRef={trRef}
						setLines={setSnapLines}
					/>
					{snapLines.horizontal.map((line, i) => (
						<Line key={i} {...line} strokeScaleEnabled={false} />
					))}
					{snapLines.vertical.map((line, i) => (
						<Line key={i} {...line} strokeScaleEnabled={false} />
					))}
				</Layer>
			</Stage>
		</div>
	);
};
export default Canvas;
