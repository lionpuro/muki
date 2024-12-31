import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useState,
} from "react";
import { CanvasTexture } from "three";

const initTexture = new CanvasTexture(document.createElement("canvas"));

export const TextureContext = createContext<{
	texture: CanvasTexture;
	setTexture: Dispatch<SetStateAction<CanvasTexture>>;
}>({
	texture: initTexture,
	setTexture: () => {},
});

export const TextureProvider = ({ children }: { children: ReactNode }) => {
	const [texture, setTexture] = useState<CanvasTexture>(initTexture);

	return (
		<TextureContext.Provider
			value={{
				texture: texture,
				setTexture: setTexture,
			}}
		>
			{children}
		</TextureContext.Provider>
	);
};
