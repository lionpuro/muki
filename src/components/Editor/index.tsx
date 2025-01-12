import { useCallback, useRef, useState } from "react";
import Canvas from "~/components/Editor/Canvas";
import { nanoid } from "nanoid";
import FilePicker from "~/components/FilePicker";
import { resolution } from "~/constants";
import {
	TbDownload as DownloadIcon,
	TbTextPlus as TextIcon,
} from "react-icons/tb";
import { Stage } from "konva/lib/Stage";
import useTextures from "~/hooks/useTextures";
import type { Transformer } from "konva/lib/shapes/Transformer";
import type { Layer } from "konva/lib/Layer";
import useShapes, { ImageData, TextData } from "~/hooks/useShapes";
import useResize from "~/hooks/useResize";
import Controls from "./Controls";

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

	const addText = () => {
		const text: TextData = {
			type: "text",
			id: nanoid(),
			width: 800,
			height: 400,
			scaleX: 1,
			scaleY: 1,
			x: Math.floor(Math.random() * 500),
			y: Math.floor(Math.random() * 200),
			fill: "#000000",
			text: "Teksti",
			fontSize: 280,
			fontStyle: "normal",
			fontFamily: "system-ui",
			align: "left",
			lineHeight: 1,
		};
		addShape(text);
		selectShape(text.id);
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

	return (
		<div className="flex flex-col grow">
			<div className="flex p-1 bg-zinc-100 border-b border-zinc-300">
				<FilePicker addImage={addImage} />
				<button
					onClick={addText}
					className={
						"flex items-center gap-2 px-4 py-2 font-medium hover:text-primary-600 active:text-primary-600"
					}
				>
					<TextIcon className="size-5" /> Teksti
				</button>
			</div>
			<div
				ref={containerRef}
				className="border border-zinc-300 bg-zinc-100 rounded m-2 sm:m-4"
			>
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
			<div className="flex flex-col bg-zinc-100 gap-4 p-4 sm:p-4 mt-auto">
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
			<div className="flex">
				<button
					onClick={handleExport}
					disabled={shapes.length < 1}
					className="ml-auto flex items-center gap-2 px-4 py-2 rounded bg-primary-600 disabled:bg-zinc-200 text-zinc-50 font-medium text-sm"
				>
					<DownloadIcon className="size-5" />
					<span className="">Lataa</span>
				</button>
			</div>
		</div>
	);
};

export default Editor;
