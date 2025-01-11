import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Dispatch, RefObject, SetStateAction, useMemo, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import ImageComponent from "~/components/Image";
import Transformer, { SnapLines } from "~/components/Editor/Transformer";
import { TextComponent } from "~/components/Text";
import { ImageData, ShapeData, TextData } from "~/hooks/useShapes";

export type Resolution = {
	width: number;
	height: number;
};

type ClickEvent = KonvaEventObject<MouseEvent | TouchEvent>;

const Canvas = ({
	stageRef,
	layerRef,
	trRef,
	size,
	scale,
	shapes,
	selectedShape,
	selectShape,
	updateShape,
	updateTexture,
}: {
	stageRef: RefObject<Konva.Stage>;
	layerRef: RefObject<Konva.Layer>;
	trRef: RefObject<Konva.Transformer>;
	size: Resolution;
	scale: number;
	shapes: ShapeData[];
	selectedShape: string | null;
	selectShape: Dispatch<SetStateAction<string | null>>;
	updateShape: <T extends ShapeData>(s: T) => void;
	updateTexture: () => void;
}) => {
	const onChange = (props: ImageData | TextData) => {
		updateShape(props);
		updateTexture();
	};

	const [snapLines, setSnapLines] = useState<SnapLines>({
		horizontal: [],
		vertical: [],
	});

	const deselect = (e: ClickEvent) => {
		if (e.target === stageRef.current) {
			selectShape(null);
		}
	};

	const renderShape = (shape: ShapeData) => {
		switch (shape.type) {
			case "image":
				return (
					<ImageComponent
						key={shape.id}
						props={shape as ImageData}
						onSelect={() => selectShape(shape.id)}
						onChange={onChange}
						onLoad={updateTexture}
					/>
				);
			case "text":
				return (
					<TextComponent
						key={shape.id}
						props={shape as TextData}
						onSelect={() => selectShape(shape.id)}
						onChange={onChange}
						onLoad={updateTexture}
					/>
				);
			default:
				return null;
		}
	};

	const isMobile = useMemo(() => size.width < 600, [size]);

	return (
		<Stage
			ref={stageRef}
			width={size.width}
			height={size.height}
			scaleX={scale}
			scaleY={scale}
			onMouseDown={deselect}
			onTouchStart={deselect}
		>
			<Layer ref={layerRef} name="main-layer">
				{shapes.map((shape) => renderShape(shape))}
			</Layer>
			<Layer>
				<Transformer
					stageRef={stageRef}
					trRef={trRef}
					setLines={setSnapLines}
					onUpdate={updateTexture}
					selectedShape={selectedShape}
					anchorSize={isMobile ? 20 : 15}
				/>
				{snapLines.horizontal.map((line, i) => (
					<Line key={i} {...line} strokeScaleEnabled={false} />
				))}
				{snapLines.vertical.map((line, i) => (
					<Line key={i} {...line} strokeScaleEnabled={false} />
				))}
			</Layer>
		</Stage>
	);
};
export default Canvas;
