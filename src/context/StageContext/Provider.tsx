import { ReactNode, useRef } from "react";
import type { Layer } from "konva/lib/Layer";
import type { Stage } from "konva/lib/Stage";
import type { Transformer } from "konva/lib/shapes/Transformer";
import { resolution } from "~/constants";
import { StageContext } from "./Context";

export const StageProvider = ({ children }: { children: ReactNode }) => {
	const stageRef = useRef<Stage>(null);
	const layerRef = useRef<Layer>(null);
	const trRef = useRef<Transformer>(null);

	const stageToDataURL = () => {
		trRef.current?.hide();
		const layer = layerRef.current;
		const stage = stageRef.current;
		if (!layer || !stage) return;

		const size = { width: stage.width(), height: stage.height() };
		const scale = stage.scaleX();

		stage.width(resolution.width);
		stage.height(resolution.height);
		stage.scaleX(1);
		stage.scaleY(1);

		const uri = layer.toDataURL();

		stage.width(size.width);
		stage.height(size.height);
		stage.scaleX(scale);
		stage.scaleY(scale);
		trRef.current?.show();
		return uri;
	};

	return (
		<StageContext.Provider
			value={{ stageRef, layerRef, trRef, stageToDataURL }}
		>
			{children}
		</StageContext.Provider>
	);
};
