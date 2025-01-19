import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import {
	Dispatch,
	ReactNode,
	RefObject,
	SetStateAction,
	useState,
} from "react";
import { Stage, Layer, Line } from "react-konva";
import Transformer, { SnapLines } from "~/editor/transformer";
import { SelectedShape } from "~/editor/shapes";

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
	selectedShape,
	selectShape,
	updateTexture,
	children,
}: {
	stageRef: RefObject<Konva.Stage>;
	layerRef: RefObject<Konva.Layer>;
	trRef: RefObject<Konva.Transformer>;
	size: Resolution;
	scale: number;
	selectedShape: SelectedShape | null;
	selectShape: Dispatch<SetStateAction<SelectedShape | null>>;
	updateTexture: () => void;
	children: ReactNode;
}) => {
	const [snapLines, setSnapLines] = useState<SnapLines>({
		horizontal: [],
		vertical: [],
	});

	const deselect = (e: ClickEvent) => {
		if (e.target === stageRef.current) {
			selectShape(null);
		}
	};

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
				{children}
			</Layer>
			<Layer>
				<Transformer
					stageRef={stageRef}
					trRef={trRef}
					setLines={setSnapLines}
					onUpdate={updateTexture}
					selectedShape={selectedShape}
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
