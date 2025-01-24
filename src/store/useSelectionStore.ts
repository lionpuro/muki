import { create } from "zustand";
import { SelectedShape } from "~/editor/shapes";

type SelectionState = {
	selected: SelectedShape | null;
	setSelected: (v: SelectedShape | null) => void;
};

export const useSelectionStore = create<SelectionState>((set) => ({
	selected: null,
	setSelected: (val: SelectedShape | null) => set(() => ({ selected: val })),
}));
