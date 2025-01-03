import { ChangeEventHandler, KeyboardEventHandler, useRef } from "react";
import { ShapeData, TextData } from "~/hooks/useShapes";
import { TbTrash as TrashIcon } from "react-icons/tb";

const TextControls = ({
	props,
	updateShape,
}: {
	props: TextData;
	updateShape: (s: ShapeData) => void;
}) => {
	const textRef = useRef<HTMLInputElement>(null);
	const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		updateShape({ ...props, [e.target.name]: e.target.value });
	};
	const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.key === "Escape" || (e.key === "Enter" && !e.shiftKey)) {
			if (!textRef.current) return;
			textRef.current.blur();
		}
	};
	return (
		<>
			<input
				ref={textRef}
				name="text"
				type="text"
				className="px-3 bg-zinc-800 border border-zinc-700 rounded"
				value={props.text}
				onChange={onChange}
				onKeyDown={onKeyDown}
			/>
			<input
				name="fill"
				type="color"
				value={props.fill}
				onChange={onChange}
				className="flex border border-zinc-700 rounded bg-transparent"
			/>
		</>
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
		<div className="flex gap-2">
			{shape.type === "image" && <></>}
			{shape.type === "text" && (
				<>
					<TextControls props={shape as TextData} updateShape={updateShape} />
				</>
			)}
			<div className="ml-auto">
				<button
					onClick={removeSelected}
					className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded bg-zinc-800 hover:bg-zinc-700"
				>
					<TrashIcon className="size-5" />
					Poista
				</button>
			</div>
		</div>
	);
};

export default Controls;
