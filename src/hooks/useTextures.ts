import { useContext } from "react";
import { CanvasTexture } from "three";
import { TextureContext } from "~/TextureContext";

const getTexture = (canvas: HTMLCanvasElement) => {
	const texture = new CanvasTexture(canvas);
	return texture;
};

export default function useTextures() {
	const { texture, setTexture } = useContext(TextureContext);
	const updateTexture = (canvas: HTMLCanvasElement) => {
		const tx = getTexture(canvas);
		setTexture(tx);
	};
	return { texture, updateTexture };
}
