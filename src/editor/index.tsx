import { FormEvent, useCallback, useRef, useState } from "react";
import Canvas from "~/editor/Canvas";
import { nanoid } from "nanoid";
import FilePicker from "~/editor/FilePicker";
import { resolution } from "~/constants";
import {
	MdDownload as DownloadIcon,
	MdTextFields as TextIcon,
} from "react-icons/md";
import { Stage } from "konva/lib/Stage";
import useTextures from "~/hooks/useTextures";
import type { Transformer } from "konva/lib/shapes/Transformer";
import type { Layer } from "konva/lib/Layer";
import useShapes, { ImageData, TextData } from "~/hooks/useShapes";
import useResize from "~/hooks/useResize";
import Controls from "./Controls";
import loadFont from "~/editor/FontPicker/loadFont";
import { Textarea } from "~/lib/components/textarea";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/lib/components/popover";

const downloadURI = (uri: string, filename: string) => {
	const link = document.createElement("a");
	link.download = filename;
	link.href = uri;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

const fitImage = (img: HTMLImageElement) => {
	const ratio = Math.min(
		resolution.width / img.width,
		resolution.height / img.height,
	);
	if (img.height > resolution.height || img.width > resolution.width) {
		return { width: img.width * ratio, height: img.height * ratio };
	}
	return { width: img.width, height: img.height };
};

const Editor = () => {
	const [selectedShape, selectShape] = useState<string | null>(null);
	const { shapes, addShape, updateShape, removeShape, findShape } = useShapes();
	const containerRef = useRef<HTMLDivElement>(null);
	const { size, scale } = useResize(containerRef);
	const stageRef = useRef<Stage>(null);
	const layerRef = useRef<Layer>(null);
	const trRef = useRef<Transformer>(null);

	const { update } = useTextures();
	const updateTexture = useCallback(() => {
		update(layerRef);
	}, [layerRef, update]);

	const removeSelected = () => {
		if (!selectedShape) return;
		removeShape(selectedShape);
		selectShape(null);
	};

	const addImage = (img: HTMLImageElement) => {
		const { width, height } = fitImage(img);
		const newImage: ImageData = {
			type: "image",
			id: nanoid(),
			width: width,
			height: height,
			x: (resolution.width - width) / 2,
			y: (resolution.height - height) / 2,
			src: img.src,
		};
		addShape(newImage);
		selectShape(newImage.id);
	};

	const addText = (text: string) => {
		const newText: TextData = {
			type: "text",
			id: nanoid(),
			width: 800,
			height: 400,
			scaleX: 1,
			scaleY: 1,
			x: Math.floor(Math.random() * 500),
			y: Math.floor(Math.random() * 200),
			fill: "#000000",
			text: text,
			fontSize: 280,
			fontStyle: "normal",
			fontFamily: "Nunito",
			align: "left",
			lineHeight: 1,
		};
		loadFont("Nunito", "normal", () => {
			addShape(newText);
			selectShape(newText.id);
		});
	};

	const handleExport = () => {
		trRef.current?.hide();
		const layer = layerRef.current;
		const stage = stageRef.current;
		if (!layer || !stage) return;

		stage.width(resolution.width);
		stage.height(resolution.height);
		stage.scaleX(1);
		stage.scaleY(1);

		const uri = layer.toDataURL();
		downloadURI(uri, "muki.png");

		stage.width(size.width);
		stage.height(size.height);
		stage.scaleX(scale);
		stage.scaleY(scale);
		trRef.current?.show();
	};

	const handleTextSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const text = e.currentTarget.text.value;
		if (text) {
			addText(text);
			setPopoverOpen(false);
		}
	};
	const [popoverOpen, setPopoverOpen] = useState(false);
	return (
		<div className="grow flex flex-col">
			<div className="flex p-2 sm:px-2 gap-2 bg-base-white border-b border-base-200 text-base-900">
				<FilePicker addImage={addImage} />
				<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
					<PopoverTrigger asChild>
						<button
							className={
								"flex items-center gap-2 p-2 hover:text-primary-600 active:text-primary-600 text-sm font-semibold"
							}
						>
							<TextIcon className="size-5" /> Teksti
						</button>
					</PopoverTrigger>
					<PopoverContent className="p-4">
						<form onSubmit={handleTextSubmit} className="flex flex-col gap-4">
							<Textarea name="text" defaultValue="Teksti" />
							<button
								type="submit"
								className="p-2 bg-primary-500 text-base-white text-sm font-semibold rounded-md"
							>
								Lisää
							</button>
						</form>
					</PopoverContent>
				</Popover>
				<button
					onClick={handleExport}
					disabled={shapes.length < 1}
					className="ml-auto flex items-center gap-2 p-2 sm:px-3 rounded-md bg-primary-500 hover:bg-primary-600 disabled:bg-base-400 text-base-50 font-semibold text-sm"
				>
					<DownloadIcon className="size-6" />
					<span className="hidden sm:block mr-1">Lataa</span>
				</button>
			</div>
			<div className="bg-base-white border-2 border-base-200 rounded-md m-2 sm:m-4 overflow-hidden">
				<div ref={containerRef}>
					<Canvas
						stageRef={stageRef}
						layerRef={layerRef}
						trRef={trRef}
						size={size}
						scale={scale}
						shapes={shapes}
						selectedShape={selectedShape}
						selectShape={selectShape}
						updateShape={updateShape}
						updateTexture={updateTexture}
					/>
				</div>
			</div>
			<div className="flex flex-col bg-base-white gap-4 p-4 sm:p-4 mt-auto">
				{selectedShape && (
					<Controls
						shape={findShape(selectedShape)}
						removeSelected={removeSelected}
						updateShape={(s) => {
							updateShape(s);
							updateTexture();
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default Editor;
