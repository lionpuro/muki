import { Layer } from "konva/lib/Layer";
import { RefObject, useCallback, useContext } from "react";
import { CanvasTexture } from "three";
import { resolution } from "~/constants";
import { TextureContext } from "~/context/TextureContext";

const toCanvas = (layerRef: RefObject<Layer>) => {
	const layer = layerRef.current;
	if (!layer) return;
	const stage = layer.getStage();
	const original = {
		width: stage.width(),
		height: stage.height(),
		scale: stage.scaleX(),
	};

	stage.width(resolution.width);
	stage.height(resolution.height);
	stage.scaleX(1);
	stage.scaleY(1);

	layer.draw();
	const canvas = layer.toCanvas();

	stage.width(original.width);
	stage.height(original.height);
	stage.scaleX(original.scale);
	stage.scaleY(original.scale);

	return canvas;
};

export default function useTextures() {
	const { texture, setTexture } = useContext(TextureContext);

	const update = useCallback(
		(layerRef: RefObject<Layer>) => {
			const canvas = toCanvas(layerRef);
			if (!canvas) return;
			setTexture(new CanvasTexture(canvas));
		},
		[setTexture],
	);

	return { texture, update };
}
