import { ChangeEventHandler, KeyboardEventHandler, useRef } from "react";
import { ShapeData, TextData } from "~/hooks/useShapes";
import { TbTrashFilled as TrashIcon } from "react-icons/tb";

const TextControls = ({
	props,
	updateShape,
	removeSelected,
}: {
	props: TextData;
	updateShape: (s: ShapeData) => void;
	removeSelected: () => void;
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
		<div className="flex flex-col">
			<span className="flex justify-between items-center mb-3">
				<h2 className="font-semibold">Teksti</h2>
				<button
					onClick={removeSelected}
					className="flex items-center p-2 sm:px-0 gap-1.5 text-sm text-zinc-800 font-medium rounded"
				>
					<TrashIcon className="size-5" />
					<span className="hidden sm:block">Poista</span>
				</button>
			</span>
			<div className="flex gap-2">
				<input
					ref={textRef}
					name="text"
					type="text"
					className="py-1 px-3 bg-zinc-50 border border-zinc-300 rounded"
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
				<>
					<TextControls
						props={shape as TextData}
						updateShape={updateShape}
						removeSelected={removeSelected}
					/>
				</>
			)}
			<div className="ml-auto"></div>
		</div>
	);
};

export default Controls;
