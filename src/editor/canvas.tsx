import { KonvaEventObject } from "konva/lib/Node";
import { ReactNode, useContext, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import Transformer, { SnapLines } from "~/editor/transformer";
import { useSelectionStore } from "~/store/useSelectionStore";
import { StageContext } from "~/context/StageContext";

export type Resolution = {
	width: number;
	height: number;
};

type ClickEvent = KonvaEventObject<MouseEvent | TouchEvent>;

const Canvas = ({
	size,
	scale,
	updateTexture,
	children,
}: {
	size: Resolution;
	scale: number;
	updateTexture: () => void;
	children: ReactNode;
}) => {
	const { stageRef, layerRef } = useContext(StageContext);
	const [snapLines, setSnapLines] = useState<SnapLines>({
		horizontal: [],
		vertical: [],
	});

	const selectShape = useSelectionStore((state) => state.setSelected);

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
			className="disable-select"
		>
			<Layer ref={layerRef} name="main-layer">
				{children}
			</Layer>
			<Layer>
				<Transformer setLines={setSnapLines} onUpdate={updateTexture} />
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
