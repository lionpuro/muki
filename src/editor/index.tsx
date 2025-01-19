import { FormEvent, useCallback, useRef, useState } from "react";
import Canvas from "~/editor/canvas";
import { resolution } from "~/constants";
import {
	MdDownload as DownloadIcon,
	MdTextFields as TextIcon,
} from "react-icons/md";
import { Stage } from "konva/lib/Stage";
import useTextures from "~/hooks/useTextures";
import type { Transformer } from "konva/lib/shapes/Transformer";
import type { Layer } from "konva/lib/Layer";
import useShapes, { createImage, createText } from "~/hooks/useShapes";
import useResize from "~/hooks/useResize";
import Controls from "~/controls";
import FilePicker from "~/controls/file-picker";
import loadFont from "~/controls/font-picker/loadFont";
import { Textarea } from "~/lib/components/textarea";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/lib/components/popover";
import {
	ImageComponent,
	ImageData,
	TextComponent,
	TextData,
	type ShapeType,
} from "~/editor/shapes";

const downloadURI = (uri: string, filename: string) => {
	const link = document.createElement("a");
	link.download = filename;
	link.href = uri;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

const Editor = () => {
	const [selectedShape, selectShape] = useState<{
		id: string;
		type: ShapeType;
	} | null>(null);
	const { shapes, addText, addImage, updateShape, removeShape, findShape } =
		useShapes();
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

	const newImage = (img: HTMLImageElement) => {
		const newImage = createImage(img);
		addImage(newImage);
		selectShape({ id: newImage.id, type: "image" });
	};

	const newText = (text: string) => {
		const newText = createText(text);
		loadFont("Nunito", "normal", () => {
			addText(newText);
			selectShape({ id: newText.id, type: "text" });
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

	const onChange = (props: ImageData | TextData) => {
		updateShape(props);
		updateTexture();
	};

	const handleTextSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const text = e.currentTarget.text.value;
		if (text) {
			newText(text);
			setPopoverOpen(false);
		}
	};
	const [popoverOpen, setPopoverOpen] = useState(false);

	return (
		<div className="grow flex flex-col">
			<div className="flex p-2 sm:px-2 gap-2 bg-base-white border-b border-base-200 text-base-900">
				<FilePicker addImage={newImage} />
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
					disabled={shapes.images.length < 1 && shapes.texts.length < 1}
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
						selectedShape={selectedShape}
						selectShape={selectShape}
						updateTexture={updateTexture}
					>
						{shapes.images.map((shape) => (
							<ImageComponent
								key={shape.id}
								props={shape}
								onSelect={() => selectShape({ id: shape.id, type: shape.type })}
								onChange={onChange}
								onLoad={updateTexture}
							/>
						))}
						{shapes.texts.map((shape) => (
							<TextComponent
								key={shape.id}
								props={shape}
								onSelect={() => selectShape({ id: shape.id, type: shape.type })}
								onChange={onChange}
								onLoad={updateTexture}
							/>
						))}
					</Canvas>
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
