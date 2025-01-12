import Konva from "konva";
import { LineConfig } from "konva/lib/shapes/Line";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { Transformer as KonvaTransformer } from "react-konva";
import { snap_threshold, snap_line_style } from "~/constants";

type Snap = "start" | "center" | "end";

type SnappingEdges = {
	vertical: Array<{
		guide: number;
		offset: number;
		snap: Snap;
	}>;
	horizontal: Array<{
		guide: number;
		offset: number;
		snap: Snap;
	}>;
};

export type SnapLines = {
	vertical: LineConfig[];
	horizontal: LineConfig[];
};

type Guide = {
	lineGuide: number;
	offset: number;
	orientation: "H" | "V";
	snap: Snap;
};

const Transformer = ({
	stageRef,
	trRef,
	setLines,
	onUpdate,
	selectedShape,
}: {
	stageRef: React.RefObject<Konva.Stage>;
	trRef: React.RefObject<Konva.Transformer>;
	setLines: Dispatch<SetStateAction<SnapLines>>;
	onUpdate: () => void;
	selectedShape: string | null;
}) => {
	const getLineGuideStops = (excludedShape: Konva.Node) => {
		const stage = stageRef.current;
		if (!stage) return { vertical: [], horizontal: [] };

		const sides = [
			stage.width() / 2 / 2.5,
			stage.width() - stage.width() / 2 / 2.5,
		];
		const vertical = [0, stage.width() / 2, stage.width(), ...sides];
		const horizontal = [0, stage.height() / 2, stage.height()];

		stage.find(".object").forEach((shape) => {
			if (shape === excludedShape) {
				return;
			}
			const box = shape.getClientRect({ relativeTo: stage });
			vertical.push(box.x, box.x + box.width, box.x + box.width / 2);
			horizontal.push(box.y, box.y + box.height, box.y + box.height / 2);
		});

		return {
			vertical,
			horizontal,
		};
	};

	const getObjectSnappingEdges = (): SnappingEdges => {
		const stage = stageRef.current;
		const tr = trRef.current;
		if (!tr || !stage) return { vertical: [], horizontal: [] };
		const box = tr.findOne(".back")?.getClientRect({ relativeTo: stage });
		const absPos = tr.findOne(".back")?.absolutePosition();
		if (!box || !absPos) return { vertical: [], horizontal: [] };

		return {
			vertical: [
				{
					guide: Math.round(box.x),
					offset: Math.round(absPos.x - box.x),
					snap: "start",
				},
				{
					guide: Math.round(box.x + box.width / 2),
					offset: Math.round(absPos.x - box.x - box.width / 2),
					snap: "center",
				},
				{
					guide: Math.round(box.x + box.width),
					offset: Math.round(absPos.x - box.x - box.width),
					snap: "end",
				},
			],
			horizontal: [
				{
					guide: Math.round(box.y),
					offset: Math.round(absPos.y - box.y),
					snap: "start",
				},
				{
					guide: Math.round(box.y + box.height / 2),
					offset: Math.round(absPos.y - box.y - box.height / 2),
					snap: "center",
				},
				{
					guide: Math.round(box.y + box.height),
					offset: Math.round(absPos.y - box.y - box.height),
					snap: "end",
				},
			],
		};
	};

	const getGuide = (
		{
			lineGuide,
			offset,
			snap,
		}: {
			lineGuide: number;
			offset: number;
			snap: Snap;
		},
		orientation: "V" | "H",
	) => {
		return { lineGuide, offset, orientation, snap };
	};

	const getGuides = (
		lineGuideStops: ReturnType<typeof getLineGuideStops>,
		objectBounds: SnappingEdges,
	) => {
		const getAllSnapLines = (direction: "vertical" | "horizontal") => {
			const result: Array<{
				lineGuide: number;
				diff: number;
				snap: Snap;
				offset: number;
			}> = [];
			lineGuideStops[direction].forEach((lineGuide) => {
				objectBounds[direction].forEach((objectBound) => {
					const diff = Math.abs(lineGuide - objectBound.guide);
					if (diff > snap_threshold) return;

					const { snap, offset } = objectBound;
					result.push({ lineGuide, diff, snap, offset });
				});
			});

			return result;
		};

		const resultV = getAllSnapLines("vertical");
		const resultH = getAllSnapLines("horizontal");

		const closestSnapLines: ReturnType<typeof getGuide>[] = [];

		const [minV] = resultV.sort((a, b) => a.diff - b.diff);
		const [minH] = resultH.sort((a, b) => a.diff - b.diff);
		if (minV) closestSnapLines.push(getGuide(minV, "V"));
		if (minH) closestSnapLines.push(getGuide(minH, "H"));

		return closestSnapLines;
	};

	const drawGuides = (guides: Guide[]) => {
		if (guides.length > 0) {
			const hLines: LineConfig[] = [];
			const vLines: LineConfig[] = [];
			const scale = stageRef.current?.scaleX() || 1;
			guides.forEach((lg) => {
				if (lg.orientation === "H") {
					const line: LineConfig = {
						points: [-6000, 0, 6000, 0],
						x: 0,
						y: lg.lineGuide / scale,
						...snap_line_style,
					};
					hLines.push(line);
				} else if (lg.orientation === "V") {
					const line: LineConfig = {
						points: [0, -6000, 0, 6000],
						x: lg.lineGuide / scale,
						y: 0,
						...snap_line_style,
					};
					vLines.push(line);
				}
			});

			setLines({ vertical: vLines, horizontal: hLines });
		}
	};

	const onDragMove = () => {
		const target = trRef.current;
		if (!target) return;
		const [selectedNode] = target.getNodes();

		if (!selectedNode) return;

		const possibleSnappingLines = getLineGuideStops(selectedNode);
		const snappingEdges = getObjectSnappingEdges();
		const guides = getGuides(possibleSnappingLines, snappingEdges);

		if (guides.length === 0) {
			setLines({ horizontal: [], vertical: [] });
			return;
		}

		drawGuides(guides);

		const orgAbsPos = target.absolutePosition();
		const absPos = target.absolutePosition();

		guides.forEach((lg) => {
			const position = lg.lineGuide + lg.offset;
			if (lg.orientation === "V") {
				absPos.x = position;
			} else if (lg.orientation === "H") {
				absPos.y = position;
			}
		});

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

	const onDragEnd = () => setLines({ horizontal: [], vertical: [] });

	// attach to selected
	useEffect(() => {
		const tr = trRef.current;
		const stage = stageRef.current;
		if (!stage || !tr) return;
		if (!selectedShape) {
			tr.nodes([]);
			return;
		}

		const selected = stage.findOne("#" + selectedShape);
		if (selected && tr.getNodes()[0] !== selected) {
			tr.nodes([selected]);
		}
	}, [selectedShape, stageRef, trRef]);

	const mobileMediaQuery = window.matchMedia("(max-width: 639px)");
	const anchorSize = useMemo(() => {
		return mobileMediaQuery.matches ? 20 : 15;
	}, [mobileMediaQuery.matches]);
	return (
		<KonvaTransformer
			ref={trRef}
			onDragMove={onDragMove}
			onDragEnd={onDragEnd}
			onTransformEnd={onUpdate}
			rotateEnabled={false}
			borderStroke="#71717a"
			borderStrokeWidth={1}
			enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
			anchorStroke="#71717a"
			anchorStrokeWidth={1}
			anchorFill="#fafafa"
			anchorSize={anchorSize}
			anchorCornerRadius={20}
			flipEnabled={false}
			centeredScaling={false}
		/>
	);
};

export default Transformer;
