import { RefObject, useEffect, useState } from "react";
import { Resolution } from "~/editor/canvas";
import useDebounce from "~/hooks/useDebounce";

export default function useContainerSize(
	ref: RefObject<HTMLElement>,
	targetResolution: Resolution,
) {
	const aspectRatio = targetResolution.height / targetResolution.width;
	const [currentSize, setCurrentSize] = useState<Resolution>({
		width: window.innerWidth,
		height: aspectRatio * window.innerWidth,
	});
	const size = useDebounce<Resolution>(currentSize, 50);
	const scale = Math.min(
		size.width / targetResolution.width,
		(aspectRatio * size.width) / targetResolution.height,
	);

	useEffect(() => {
		const container = ref.current;
		const setSize = () => {
			if (!container) return;
			const width = container.clientWidth;
			const height = container.clientHeight;
			setCurrentSize({
				width: width,
				height: height,
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
