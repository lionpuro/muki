import { useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/lib/components/popover";
import { XIcon } from "~/lib/icons";

export const ColorPicker = ({
	color,
	updateColor,
}: {
	color: string;
	updateColor: (c: string) => void;
}) => {
	const [value, setValue] = useState(color);
	const onChange = (c: string) => setValue(c);
	const onEnd = () => updateColor(value);
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Popover open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
			<div className="flex gap-2">
				<span className="bg-base-white flex relative overflow-hidden before:content-['#'] before:absolute before:left-14 before:top-1/2 before:transform before:-translate-y-1/2 before:font-bold before:text-base-600 border rounded-lg">
					<PopoverTrigger asChild>
						<button
							className="size-10 rounded-lg"
							style={{ backgroundColor: value }}
						/>
					</PopoverTrigger>
					<span className="flex items-center">
						<HexColorInput
							className="mx-1 pl-10 py-0 font-medium max-w-48 w-full sm:max-w-40 bg-transparent focus-within:outline-none focus-within:border-b border-primary-400"
							color={value}
							onChange={(c) => {
								setValue(c);
								updateColor(c);
							}}
						/>
					</span>
				</span>
				{/*
				 */}
			</div>
			<PopoverContent
				id="colorpicker-popover"
				className="w-fit rounded-lg ml-4 p-0"
			>
				<div className="flex flex-col">
					<div className="flex">
						<button className="ml-auto p-2" onClick={() => setIsOpen(false)}>
							<XIcon className="text-base-800 size-4" />
						</button>
					</div>
					<HexColorPicker
						color={value}
						onChange={onChange}
						onMouseUp={onEnd}
						onTouchEnd={onEnd}
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
};
