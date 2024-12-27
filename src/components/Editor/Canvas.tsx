import { KonvaEventObject } from "konva/lib/Node";
import { Dispatch, SetStateAction } from "react";
import { Stage, Layer } from "react-konva";
import ImageComponent, { ImageProps } from "~/components/Image";

export type Resolution = {
	width: number;
	height: number;
};

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
	images: ImageProps[];
	setImages: (imgs: ImageProps[]) => void;
	selectedImage: string | null;
	selectImage: Dispatch<SetStateAction<string | null>>;
}) => {
	const deselect = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
		const clickedEmpty = e.target === e.target.getStage();
		if (clickedEmpty) {
			selectImage(null);
		}
	};

	return (
		<div className="bg-zinc-800 rounded">
			<Stage
				width={size.width}
				height={size.height}
				scaleX={scale}
				scaleY={scale}
				onMouseDown={deselect}
				onTouchStart={deselect}
			>
				<Layer>
					{images.map((img, i) => (
						<ImageComponent
							key={img.id}
							imageProps={img}
							isSelected={img.id === selectedImage}
							onSelect={() => selectImage(img.id)}
							onChange={(newAttrs) => {
								const imgs = images.slice();
								imgs[i] = newAttrs;
								setImages(imgs);
							}}
						/>
					))}
				</Layer>
			</Stage>
		</div>
	);
};
export default Canvas;
