import { create } from "zustand";
import { TextData } from "~/editor/shapes";

type TextState = {
	texts: TextData[];
	setTexts: (texts: TextData[]) => void;
	addText: (i: TextData) => void;
	deleteText: (id: string) => void;
	updateText: (props: TextData) => void;
	findText: (id: string) => TextData | undefined;
};

export const useTextStore = create<TextState>((set, get) => ({
	texts: [],
	setTexts: (texts: TextData[]) => set(() => ({ texts: texts })),
	addText: (text: TextData) =>
		set((state) => ({ texts: [...state.texts, text] })),
	deleteText: (id: string) =>
		set((state) => ({ texts: state.texts.filter((i) => i.id !== id) })),
	updateText: (props: TextData) =>
		set((state) => ({
			texts: state.texts.map((txt) => (txt.id === props.id ? props : txt)),
		})),
	findText: (id: string) => get().texts.find((txt) => txt.id === id),
}));
