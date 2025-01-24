import { TextControls } from "./text-controls";
import { useSelectionStore } from "~/store/useSelectionStore";
import { useTextStore } from "~/store/useTextStore";

export const Controls = () => {
	const selectedShape = useSelectionStore((state) => state.selected);
	const texts = useTextStore((state) => state.texts);
	if (!selectedShape) {
		return null;
	}
	if (selectedShape.type === "image") {
		return null;
	}
	if (selectedShape.type === "text") {
		const props = texts.find((txt) => txt.id === selectedShape.id);
		if (!props) return null;
		return <TextControls props={props} />;
	}
	return null;
};
