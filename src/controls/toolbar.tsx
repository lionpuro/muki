import { useRef, useState } from "react";
import { createImage, createText } from "~/editor/shapes";
import { useImageStore } from "~/store/useImageStore";
import { useTextStore } from "~/store/useTextStore";
import { useSelectionStore } from "~/store/useSelectionStore";
import loadFont from "~/controls/font-picker/loadFont";
import FilePicker from "~/controls/file-picker";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/lib/components/popover";
import { Button } from "~/lib/components/button";
import { PlusIcon, DeleteOutlineIcon } from "~/lib/icons";

export const Toolbar = () => {
	const textRef = useRef<HTMLInputElement>(null);
	const [popoverOpen, setPopoverOpen] = useState(false);

	const selectedShape = useSelectionStore((state) => state.selected);
	const selectShape = useSelectionStore((state) => state.setSelected);
	const deleteText = useTextStore((state) => state.deleteText);
	const deleteImage = useImageStore((state) => state.deleteImage);
	const addText = useTextStore((state) => state.addText);
	const addImage = useImageStore((state) => state.addImage);

	const handleAddImage = (img: HTMLImageElement) => {
		const newImage = createImage(img);
		addImage(newImage);
		selectShape({ id: newImage.id, type: "image" });
		setPopoverOpen(false);
	};

	const handleAddText = () => {
		const text = textRef.current?.value;
		if (!text || text.length < 1) {
			return;
		}
		const newText = createText(text);
		loadFont("Nunito", "normal", () => {
			addText(newText);
			selectShape({ id: newText.id, type: "text" });
		});
		textRef.current.value = "";
		setPopoverOpen(false);
	};

	const removeSelected = () => {
		if (!selectedShape) return;
		if (selectedShape.type === "image") {
			deleteImage(selectedShape.id);
		} else {
			deleteText(selectedShape.id);
		}
		selectShape(null);
	};

	return (
		<div className="flex items-center">
			<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
				<PopoverTrigger asChild>
					<Button variant="primary" size="icon">
						<PlusIcon className="size-6" />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="ml-4 mt-1 rounded-lg"
					onOpenAutoFocus={(e) => e.preventDefault()}
				>
					<div className="flex flex-col p-4 gap-4">
						<FilePicker submitImage={handleAddImage} />
						<span className="flex gap-4">
							<input
								ref={textRef}
								type="text"
								className="min-w-0 py-1 px-4 bg-base-white border border-base-200 rounded-lg text-sm"
								placeholder="Lisää teksti..."
							/>
							<Button
								variant="primary"
								size="icon"
								className="shrink-0"
								onClick={handleAddText}
							>
								<PlusIcon className="size-6" />
							</Button>
						</span>
					</div>
				</PopoverContent>
			</Popover>
			{selectedShape && (
				<div className="ml-auto flex">
					<button
						onClick={removeSelected}
						className="size-10 flex items-center justify-center text-base-900"
					>
						<DeleteOutlineIcon className="size-6" />
					</button>
				</div>
			)}
		</div>
	);
};
