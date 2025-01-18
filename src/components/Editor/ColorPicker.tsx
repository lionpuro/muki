import { useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/lib/components/popover";
import { MdClose as XIcon } from "react-icons/md";

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
				<span className="flex relative bg-base-100 rounded-md overflow-hidden before:content-['#'] before:absolute before:left-14 before:top-1/2 before:transform before:-translate-y-1/2 before:font-bold before:text-base-600">
					<PopoverTrigger asChild>
						<button className="w-10 h-9" style={{ backgroundColor: value }} />
					</PopoverTrigger>
					<span className="flex items-center focus-within:after:content-['_'] focus-within:after:bg-primary-400 focus-within:after:h-[2px] focus-within:after:w-full relative after:absolute after:bottom-0 after:left-0">
						<HexColorInput
							className="pl-10 py-0 font-medium max-w-48 bg-transparent focus-within:outline-none"
							color={value}
							onChange={(c) => {
								setValue(c);
								updateColor(c);
							}}
						/>
					</span>
				</span>
			</div>
			<PopoverContent
				id="colorpicker-popover"
				className="w-fit rounded-md ml-4 p-0"
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
