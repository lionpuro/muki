import { useState } from "react";
import {
	MdFormatBold as BoldIcon,
	MdFormatItalic as ItalicIcon,
} from "react-icons/md";
import { ImFont as FontIcon } from "react-icons/im";
import { Button } from "~/components/Editor/Controls";
import { fonts } from "~/constants";
import loadFont from "./loadFont";

export type Font = {
	family: string;
	urlName: string;
	variants: Variant[];
};

export type Variant = "normal" | "italic" | "bold" | "italic bold";

export type SelectedFont = {
	family: string;
	variant: Variant;
};

const getVariant = (
	current: Variant,
	selected: Extract<Variant, "bold" | "italic">,
): Variant => {
	switch (current) {
		case selected:
			return "normal";
		case "normal":
			return selected;
		case "italic":
			return "italic bold";
		case "bold":
			return "italic bold";
		case "italic bold":
			return selected === "italic" ? "bold" : "italic";
	}
	return selected;
};

export const FontPicker = ({
	current,
	setFont,
}: {
	current: { family: string; variant: Variant };
	setFont: (font: { family: string; variant: Variant }) => void;
}) => {
	const selectFamily = (fam: string) => {
		const font = fonts.find((f) => f.family === fam);
		if (!font) return;
		loadFont(fam, "normal", () => {
			setFont({ family: fam, variant: "normal" });
		});
	};

	const selectVariant = (val: Extract<Variant, "bold" | "italic">) => {
		const newVariant = getVariant(current.variant, val);
		const available = fonts
			.find((f) => f.family === current.family)
			?.variants.includes(newVariant);
		if (!available) {
			return console.error("trying to use a font variant that is unavailable");
		}
		loadFont(current.family, newVariant, () => {
			setFont({ family: current.family, variant: newVariant });
		});
	};

	const [open, setOpen] = useState(false);
	const handleOpen = () => {
		fonts.forEach((font) => {
			loadFont(font.family, "normal", () => {});
		});
		setOpen(!open);
	};

	return (
		<div className="grow flex gap-2">
			<button
				onClick={handleOpen}
				className="flex items-center justify-center gap-2 w-[calc(50%-0.25rem)] border-2 border-zinc-300 rounded font-medium"
			>
				<FontIcon className="size-4" />
				Valitse fontti
			</button>
			{!!open && (
				<div
					onClick={() => setOpen(false)}
					className="z-50 absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center"
				>
					<div
						onClick={(e) => e.stopPropagation()}
						className="flex flex-col w-full max-w-screen-sm bg-zinc-100 rounded overflow-hidden"
					>
						<ul className=" flex flex-col bg-zinc-50">
							{fonts.map((font) => (
								<li
									key={font.family}
									onClick={() => {
										selectFamily(font.family);
										setOpen(false);
									}}
									style={{ fontFamily: font.family }}
									className={`cursor-pointer py-3 px-6 text-2xl ${current.family === font.family ? "bg-zinc-200 bg-opacity-70" : ""} hover:bg-zinc-200`}
								>
									<span>{font.family}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}

			<Button
				disabled={
					!fonts
						.find((f) => f.family === current.family)
						?.variants.includes("bold")
				}
				selected={
					current.variant === "bold" || current.variant === "italic bold"
				}
				onClick={() => selectVariant("bold")}
			>
				<BoldIcon className="size-6" />
			</Button>
			<Button
				disabled={
					!fonts
						.find((f) => f.family === current.family)
						?.variants.includes("italic")
				}
				selected={
					current.variant === "italic" || current.variant === "italic bold"
				}
				onClick={() => selectVariant("italic")}
			>
				<ItalicIcon className="size-6" />
			</Button>
		</div>
	);
};
