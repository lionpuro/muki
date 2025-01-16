import {
	ButtonHTMLAttributes,
	ChangeEvent,
	KeyboardEventHandler,
	useRef,
} from "react";
import { ShapeData, TextData } from "~/hooks/useShapes";
import {
	MdDelete as TrashIcon,
	//MdFormatLineSpacing as LineHeightIcon,
	MdFormatAlignLeft as AlignLeftIcon,
	MdFormatAlignCenter as AlignCenterIcon,
	MdFormatAlignRight as AlignRightIcon,
} from "react-icons/md";
import clsx from "clsx";
import { FontPicker, FontVariant } from "~/components/FontPicker";

type ButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	"className"
> & {
	selected?: boolean;
};

export const Button = ({ selected, children, ...props }: ButtonProps) => {
	return (
		<button
			className={clsx(
				"grow flex justify-center items-center p-2 bg-zinc-100",
				"text-zinc-800 border-2 rounded",
				"disabled:bg-zinc-200 disabled:text-zinc-500",
				{
					"border-primary-400": selected === true,
					"border-zinc-300": !selected,
				},
			)}
			{...props}
		>
			{children}
		</button>
	);
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

	const onChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		updateShape({ ...props, [e.target.name]: e.target.value });
	};

	const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
		if (e.key === "Escape" || (e.key === "Enter" && !e.shiftKey)) {
			if (!textRef.current) return;
			textRef.current.blur();
		}
	};

	const selectFont = (font: { family: string; variant: FontVariant }) => {
		updateShape({ ...props, fontFamily: font.family, fontStyle: font.variant });
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
			<div className="flex flex-col w-full sm:w-1/2">
				<span className="py-2 px-1 font-semibold text-sm">Fontti</span>
				<FontPicker
					current={{
						family: props.fontFamily,
						variant: props.fontStyle,
					}}
					setFont={selectFont}
				/>
			</div>
			<div className="flex justify-between gap-2 w-full sm:w-1/2 overflow-hidden">
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
				<TextControls
					props={shape as TextData}
					updateShape={updateShape}
					removeSelected={removeSelected}
				/>
			)}
		</div>
	);
};

export default Controls;
