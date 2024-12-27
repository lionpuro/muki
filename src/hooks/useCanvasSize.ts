import { useEffect, useState } from "react";
import { Resolution } from "~/components/Editor/Canvas";
import { aspectRatio, resolution, margin } from "~/constants";
import useDebounce from "~/hooks/useDebounce";

export default function useCanvasSize() {
	const [currentSize, setCurrentSize] = useState<Resolution>({
		width: window.innerWidth - margin,
		height: aspectRatio * (window.innerWidth - 32),
	});
	const size = useDebounce<Resolution>(currentSize, 100);
	const scale = Math.min(
		currentSize.width / resolution.width,
		(aspectRatio * currentSize.width) / resolution.height,
	);

	useEffect(() => {
		const setSize = () =>
			setCurrentSize({
				width: window.innerWidth - 32,
				height: aspectRatio * (window.innerWidth - 32),
			});
		window.addEventListener("resize", setSize);
		return () => window.removeEventListener("resize", setSize);
	}, []);

	return {
		size,
		scale,
	};
}
