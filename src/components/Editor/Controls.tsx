import {
	ButtonHTMLAttributes,
	ChangeEvent,
	KeyboardEventHandler,
	ReactNode,
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
import { ColorPicker } from "./ColorPicker";

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
				"flex justify-center items-center p-2 text-base-900 rounded-md",
				"disabled:bg-base-200 disabled:text-base-500",
				selected === true ? "bg-primary-400" : "bg-base-100",
			)}
			{...props}
		>
			{children}
		</button>
	);
};

const ToggleButton = ({ selected, children, ...props }: ButtonProps) => {
	return (
		<button
			className={clsx(
				"flex justify-center items-center p-2 text-base-900 rounded-md",
				"disabled:bg-base-200 disabled:text-base-500",
				selected === true && "bg-primary-400",
			)}
			{...props}
		>
			{children}
		</button>
	);
};

const Label = ({ children }: { children: ReactNode }) => (
	<span className="font-semibold text-base-900">{children}</span>
);

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
		<div className="flex flex-col gap-4">
			<span className="flex justify-between items-center mb-3">
				<h2 className="font-semibold">Muokkaa tekstiä</h2>
				<button
					onClick={removeSelected}
					className="flex items-center p-2 sm:px-0 gap-1.5 text-sm text-base-800 hover:text-[#f75e68] font-medium rounded-md"
				>
					<TrashIcon className="size-5" />
					<span className="hidden sm:block">Poista</span>
				</button>
			</span>
			<div className="flex">
				<textarea
					ref={textRef}
					name="text"
					className="w-full sm:w-1/2 py-1 px-3 bg-base-white border border-base-200 rounded-md"
					style={{ resize: "none" }}
					value={props.text}
					onChange={onChange}
					onKeyDown={onKeyDown}
				/>
			</div>
			<div className="flex flex-col gap-2 w-full sm:w-1/2">
				<Label>Fontti</Label>
				<FontPicker
					current={{
						family: props.fontFamily,
						variant: props.fontStyle,
					}}
					setFont={selectFont}
				/>
			</div>
			<div className="flex items-center justify-between gap-2 w-full sm:w-1/2 overflow-hidden">
				<Label>Tasaus</Label>
				<div className="flex bg-base-100 rounded-lg p-0.5">
					<ToggleButton
						selected={props.align === "left"}
						onClick={() => updateProp("align", "left")}
					>
						<AlignLeftIcon className="size-6" />
					</ToggleButton>
					<ToggleButton
						selected={props.align === "center"}
						onClick={() => updateProp("align", "center")}
					>
						<AlignCenterIcon className="size-6" />
					</ToggleButton>
					<ToggleButton
						selected={props.align === "right"}
						onClick={() => updateProp("align", "right")}
					>
						<AlignRightIcon className="size-6" />
					</ToggleButton>
				</div>
			</div>
			<div className="flex items-center justify-between">
				<Label>Väri</Label>
				<ColorPicker
					color={props.fill}
					updateColor={(c) => updateProp("fill", c)}
				/>
			</div>
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
