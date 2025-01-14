import { Variant } from "~/components/FontPicker";
import { fonts } from "~/constants";

export default function loadFont(
	family: string,
	variant: Variant,
	callback: () => void,
) {
	const font = fonts.find((f) => f.family === family);
	if (!font) return;
	const fontID = `font-${font.urlName}-${variant.replace(" ", "-")}`;
	const existing = document.querySelector("#" + fontID);
	if (!existing) {
		const link = document.createElement("link");
		const weight = variant === "bold" || variant === "italic bold" ? 700 : 400;
		const italic = variant === "italic" || variant === "italic bold" ? "i" : "";
		const url = `https://fonts.bunny.net/css?family=${font.urlName}:${weight}${italic}`;
		link.rel = "stylesheet";
		link.id = fontID;
		link.href = url;
		link.onload = callback;
		document.head.appendChild(link);
		return;
	}
	callback();
}
