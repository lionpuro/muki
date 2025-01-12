import {
	ButtonHTMLAttributes,
	ChangeEventHandler,
	KeyboardEventHandler,
	useRef,
} from "react";
import { ShapeData, TextData } from "~/hooks/useShapes";
import {
	MdDelete as TrashIcon,
	MdFormatBold as BoldIcon,
	MdFormatItalic as ItalicIcon,
	MdFormatLineSpacing as LineHeightIcon,
	MdFormatAlignLeft as AlignLeftIcon,
	MdFormatAlignCenter as AlignCenterIcon,
	MdFormatAlignRight as AlignRightIcon,
} from "react-icons/md";
import clsx from "clsx";

type ButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	"className"
> & {
	selected?: boolean;
};

const Button = ({ selected, children, ...props }: ButtonProps) => {
	return (
		<button
			className={clsx(
				"grow flex justify-center items-center p-2 bg-zinc-100 text-zinc-800",
				{ "bg-zinc-200": selected === true },
			)}
			{...props}
		>
			{children}
		</button>
	);
};

type FontStyle = TextData["fontStyle"];

const getNewStyle = (
	current: FontStyle,
	selected: Extract<FontStyle, "bold" | "italic">,
): FontStyle => {
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

const TextControls = ({
	props,
	updateShape,
	removeSelected,
}: {
	props: TextData;
	updateShape: (s: ShapeData) => void;
	removeSelected: () => void;
}) => {
	const textRef = useRef<HTMLTextAreaElement>(null);
	const updateProp = <K extends keyof TextData>(key: K, value: TextData[K]) => {
		updateShape({ ...props, [key]: value });
	};
	const onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (
		e,
	) => {
		updateShape({ ...props, [e.target.name]: e.target.value });
	};
	const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
		if (e.key === "Escape" || (e.key === "Enter" && !e.shiftKey)) {
			if (!textRef.current) return;
			textRef.current.blur();
		}
	};

	const toggleFontStyle = (style: Extract<FontStyle, "bold" | "italic">) => {
		updateProp("fontStyle", getNewStyle(props.fontStyle, style));
	};
	return (
		<div className="flex flex-col gap-2">
			<span className="flex justify-between items-center mb-3">
				<h2 className="font-semibold">Muokkaa tekstiä</h2>
				<button
					onClick={removeSelected}
					className="flex items-center p-2 sm:px-0 gap-1.5 text-sm text-zinc-800 hover:text-[#f75e68] font-medium rounded"
				>
					<TrashIcon className="size-5" />
					<span className="hidden sm:block">Poista</span>
				</button>
			</span>
			<div className="flex gap-2">
				<textarea
					ref={textRef}
					name="text"
					className="w-full sm:w-1/2 py-1 px-3 bg-zinc-50 border border-zinc-300 rounded"
					style={{ resize: "none" }}
					value={props.text}
					onChange={onChange}
					onKeyDown={onKeyDown}
				/>
			</div>
			<div className="flex justify-between gap-px bg-zinc-300 border border-zinc-300 rounded w-full sm:w-1/2 overflow-hidden">
				<Button>
					<LineHeightIcon className="size-6" />
				</Button>

				<Button
					selected={props.align === "left"}
					onClick={() => updateProp("align", "left")}
				>
					<AlignLeftIcon className="size-6" />
				</Button>
				<Button
					selected={props.align === "center"}
					onClick={() => updateProp("align", "center")}
				>
					<AlignCenterIcon className="size-6" />
				</Button>
				<Button
					selected={props.align === "right"}
					onClick={() => updateProp("align", "right")}
				>
					<AlignRightIcon className="size-6" />
				</Button>

				<Button
					selected={
						props.fontStyle === "bold" || props.fontStyle === "italic bold"
					}
					onClick={() => toggleFontStyle("bold")}
				>
					<BoldIcon className="size-6" />
				</Button>
				<Button
					selected={
						props.fontStyle === "italic" || props.fontStyle === "italic bold"
					}
					onClick={() => toggleFontStyle("italic")}
				>
					<ItalicIcon className="size-6" />
				</Button>
			</div>
			<input
				name="fill"
				type="color"
				value={props.fill}
				onChange={onChange}
				className="flex border border-zinc-700 rounded bg-transparent"
			/>
		</div>
	);
};

const Controls = ({
	shape,
	updateShape,
	removeSelected,
}: {
	shape: ShapeData | undefined;
	updateShape: (s: ShapeData) => void;
	removeSelected: () => void;
}) => {
	if (!shape) return null;
	return (
		<div className="flex flex-col">
			{shape.type === "image" && <></>}
			{shape.type === "text" && (
				<>
					<TextControls
						props={shape as TextData}
						updateShape={updateShape}
						removeSelected={removeSelected}
					/>
				</>
			)}
		</div>
	);
};

export default Controls;
