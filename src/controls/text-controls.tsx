import clsx from "clsx";
import {
	ButtonHTMLAttributes,
	ChangeEvent,
	KeyboardEventHandler,
	ReactNode,
	useRef,
	useState,
} from "react";
import { TextData } from "~/editor/shapes";
import { FontPicker, FontVariant } from "./font-picker";
import { Textarea } from "~/lib/components/textarea";
import { ColorPicker } from "./color-picker";
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from "~/lib/icons";
import { useTextStore } from "~/store/useTextStore";

export const TextControls = ({ props }: { props: TextData }) => {
	const textRef = useRef<HTMLTextAreaElement>(null);

	const updateText = useTextStore((state) => state.updateText);

	const updateProp = <K extends keyof TextData>(key: K, value: TextData[K]) => {
		updateText({ ...props, [key]: value });
	};

	const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
		if (e.key === "Escape" || (e.key === "Enter" && !e.shiftKey)) {
			if (!textRef.current) return;
			textRef.current.blur();
		}
	};

	const selectFont = (font: { family: string; variant: FontVariant }) => {
		updateText({ ...props, fontFamily: font.family, fontStyle: font.variant });
	};

	const [textValue, setTextValue] = useState(props.text);
	const timeoutRef = useRef<number | null>(null);
	const onTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		setTextValue(e.target.value);
		timeoutRef.current = setTimeout(() => {
			updateText({ ...props, text: e.target.value });
		}, 200);
	};

	return (
		<div className="flex flex-col gap-4 p-2 sm:p-8 sm:mx-auto sm:w-full sm:max-w-[500px]">
			<div className="flex flex-col gap-2">
				<Label>Teksti</Label>
				<Textarea
					ref={textRef}
					name="text"
					style={{ resize: "none" }}
					value={textValue}
					onChange={onTextChange}
					onKeyDown={onKeyDown}
				/>
			</div>
			<div className="flex flex-col gap-2 sm:items-stretch justify-between">
				<Label>Väri</Label>
				<ColorPicker
					color={props.fill}
					updateColor={(c) => updateProp("fill", c)}
				/>
			</div>
			<div className="flex flex-col gap-2">
				<Label>Fontti</Label>
				<FontPicker
					current={{
						family: props.fontFamily,
						variant: props.fontStyle,
					}}
					setFont={selectFont}
				/>
			</div>
			<div className="hidden sm:flex items-center justify-between gap-2 w-full overflow-hidden">
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
		</div>
	);
};

type ButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	"className"
> & {
	selected?: boolean;
};

const ToggleButton = ({ selected, children, ...props }: ButtonProps) => {
	return (
		<button
			className={clsx(
				"flex justify-center items-center p-2 text-base-900 rounded-md",
				"disabled:bg-base-200 disabled:text-base-500",
				selected === true && "bg-base-950 text-base-white",
			)}
			{...props}
		>
			{children}
		</button>
	);
};

const Label = ({ children }: { children: ReactNode }) => (
	<span className="text-sm font-medium text-base-700">{children}</span>
);
