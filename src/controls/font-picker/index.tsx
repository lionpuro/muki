import clsx from "clsx";
import { fonts } from "~/constants";
import loadFont from "./loadFont";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
	SelectGroup,
} from "~/lib/components/select";
import { BoldIcon, ItalicIcon } from "~/lib/icons";
import { ButtonHTMLAttributes, ReactNode } from "react";

export type Font = {
	family: string;
	urlName: string;
	variants: FontVariant[];
};

export type FontVariant = "normal" | "italic" | "bold" | "italic bold";

export type SelectedFont = {
	family: string;
	variant: FontVariant;
};

const getVariant = (
	current: FontVariant,
	selected: Extract<FontVariant, "bold" | "italic">,
): FontVariant => {
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
	current: { family: string; variant: FontVariant };
	setFont: (font: { family: string; variant: FontVariant }) => void;
}) => {
	const selectFamily = (fam: string) => {
		const font = fonts.find((f) => f.family === fam);
		if (!font) return;
		loadFont(fam, "normal", () => {
			setFont({ family: fam, variant: "normal" });
		});
	};

	const selectVariant = (val: Extract<FontVariant, "bold" | "italic">) => {
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

	const onOpen = () => {
		fonts.forEach((font) => {
			loadFont(font.family, "normal");
		});
	};

	return (
		<>
			<div className="flex gap-2">
				<div className="w-full flex min-w-40 max-w-48 sm:max-w-56">
					<Select
						onOpenChange={onOpen}
						value={current.family}
						onValueChange={(v) => selectFamily(v)}
					>
						<SelectTrigger className="h-10 text-base bg-base-white">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{fonts.map((font) => (
									<SelectItem
										key={font.family}
										value={font.family}
										className="text-base"
									>
										<span style={{ fontFamily: font.family }}>
											{font.family}
										</span>
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div className="ml-auto flex gap-2">
					<PushButton
						title="Lihavointi"
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
					</PushButton>
					<PushButton
						title="Kursivointi"
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
					</PushButton>
				</div>
			</div>
		</>
	);
};

const PushButton = ({
	selected,
	children,
	...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
	selected: boolean;
	children?: ReactNode;
}) => {
	return (
		<button
			className={clsx(
				"size-10 flex justify-center items-center text-base-900 rounded-md",
				"disabled:bg-base-200 disabled:text-base-500",
				selected === true ? "bg-primary-400" : "bg-base-white",
			)}
			{...props}
		>
			{children}
		</button>
	);
};
