import { useEffect, useState } from "react";

export default function useMobile() {
	const [isMobile, setIsMobile] = useState(false);
	const callback = (entries: ResizeObserverEntry[]) => {
		const { width } = entries[0].contentRect;
		setIsMobile(width <= 640);
	};

	useEffect(() => {
		const target = document.body;
		const observer = new ResizeObserver(callback);
		observer.observe(target);

		return () => {
			observer.unobserve(target);
		};
	}, []);

	return { isMobile };
}
