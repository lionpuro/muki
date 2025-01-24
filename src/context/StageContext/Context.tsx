import { createContext, createRef, RefObject } from "react";
import type { Layer } from "konva/lib/Layer";
import type { Stage } from "konva/lib/Stage";
import type { Transformer } from "konva/lib/shapes/Transformer";

type StageContextType = {
	stageRef: RefObject<Stage>;
	layerRef: RefObject<Layer>;
	trRef: RefObject<Transformer>;
	stageToDataURL: () => string | undefined;
};

export const StageContext = createContext<StageContextType>({
	stageRef: createRef<Stage>(),
	layerRef: createRef<Layer>(),
	trRef: createRef<Transformer>(),
	stageToDataURL: () => undefined,
});
