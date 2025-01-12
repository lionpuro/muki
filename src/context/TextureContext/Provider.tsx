import { ReactNode, useState } from "react";
import { CanvasTexture } from "three";
import { TextureContext, initTexture } from "~/context/TextureContext/Context";

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
