import { useLayoutEffect, useRef, useState } from "react";

type Status = "loading" | "loaded" | "failed";

export default function useImage(
	url: string,
	callback?: () => void,
): [img: HTMLImageElement | undefined, status: Status] {
	const statusRef = useRef<Status>("loading");
	const imageRef = useRef<HTMLImageElement | undefined>(undefined);

	// we are not going to use token but we need to just to trigger state update
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setStateToken] = useState(0);

	// keep track of old props to trigger changes
	const oldUrl = useRef<string | undefined>();
	if (oldUrl.current !== url) {
		statusRef.current = "loading";
		imageRef.current = undefined;
		oldUrl.current = url;
	}

	useLayoutEffect(() => {
		if (!url) return;
		const img = document.createElement("img");

		const onload = () => {
			statusRef.current = "loaded";
			imageRef.current = img;
			setStateToken(Math.random());
			if (callback) {
				callback();
			}
		};

		const onerror = () => {
			statusRef.current = "failed";
			imageRef.current = undefined;
			setStateToken(Math.random());
		};

		img.addEventListener("load", onload);
		img.addEventListener("error", onerror);
		img.src = url;

		return () => {
			img.removeEventListener("load", onload);
			img.removeEventListener("error", onerror);
		};
	}, [url, callback]);

	return [imageRef.current, statusRef.current];
}
