import { createContext, Dispatch, SetStateAction } from "react";
import { CanvasTexture } from "three";

export const initTexture = new CanvasTexture(document.createElement("canvas"));

export const TextureContext = createContext<{
	texture: CanvasTexture;
	setTexture: Dispatch<SetStateAction<CanvasTexture>>;
}>({
	texture: initTexture,
	setTexture: () => {},
});
