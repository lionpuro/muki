import { RefObject, useEffect, useState } from "react";
import { Resolution } from "~/editor/canvas";
import { aspectRatio, resolution } from "~/constants";
import useDebounce from "~/hooks/useDebounce";

export default function useResize(ref: RefObject<HTMLElement>) {
	const [currentSize, setCurrentSize] = useState<Resolution>({
		width: window.innerWidth,
		height: aspectRatio * (window.innerWidth - 32),
	});
	const size = useDebounce<Resolution>(currentSize, 50);
	const scale = Math.min(
		size.width / resolution.width,
		(aspectRatio * size.width) / resolution.height,
	);

	useEffect(() => {
		const container = ref.current;
		const setSize = () => {
			if (!container) return;
			const width = container.clientWidth;
			setCurrentSize({
				width: width,
				height: aspectRatio * width,
			});
		};
		const observer = new ResizeObserver(setSize);
		if (container) {
			observer.observe(container);
		}
		setSize();

		return () => {
			if (container) {
				observer.unobserve(container);
			}
		};
	}, [ref]);

	return {
		size,
		scale,
	};
}
