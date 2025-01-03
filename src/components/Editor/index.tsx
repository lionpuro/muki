import {
	useRef,
	useState,
} from "react";
import Canvas from "~/components/Editor/Canvas";
import { nanoid } from "nanoid";
import FilePicker from "~/components/FilePicker";
import { resolution } from "~/constants";
import {
	TbDownload as DownloadIcon,
	TbTextPlus as TextIcon,
} from "react-icons/tb";
import { Stage } from "konva/lib/Stage";
import { Transformer } from "konva/lib/shapes/Transformer";
import useTextures from "~/hooks/useTextures";
import { Layer } from "konva/lib/Layer";
import useShapes, { ImageData, TextData } from "~/hooks/useShapes";
import useResize from "~/hooks/useResize";
import Controls from "./Controls";

const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
	return (
		<button
			className={
				"flex items-center gap-2 px-4 py-2 text-sm font-medium rounded bg-zinc-800 hover:bg-zinc-700"
			}
			{...props}
		>
			{props.children}
		</button>
	);
};

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

	const { updateTexture } = useTextures();

	const upscaled = () => {
		const stage = stageRef.current;
		if (!stage || !layerRef.current) return;

		stage.clone();
		stage.width(resolution.width);
		stage.height(resolution.height);
		stage.scaleX(1);
		stage.scaleY(1);

		const canvas = layerRef.current.toCanvas();

		stage.width(size.width);
		stage.height(size.height);
		stage.scaleX(scale);
		stage.scaleY(scale);

		return canvas;
	};
	const handleUpdate = (delay: boolean) => {
		if (delay) {
			setTimeout(() => {
				const cnv = upscaled();
				if (!cnv) return;
				updateTexture(cnv);
			}, 100);
			return;
		}
		const cnv = upscaled();
		if (!cnv) return;
		updateTexture(cnv);
	};

	const removeSelected = () => {
		if (!selectedShape) return;
		removeShape(selectedShape);
		selectShape(null);
		handleUpdate(true);
	};

	const addImage = (img: HTMLImageElement) => {
		const { width, height } = fitImage(img);
		const newImage: ImageData = {
			type: "image",
			id: nanoid(),
			src: img.src,
			width: width,
			height: height,
			x: (resolution.width - width) / 2,
			y: (resolution.height - height) / 2,
		};
		addShape(newImage);
		selectShape(newImage.id);
		handleUpdate(true);
	};

	const addText = () => {
		const text: TextData = {
			type: "text",
			id: nanoid(),
			width: 800,
			height: 400,
			scaleX: 1,
			scaleY: 1,
			x: (resolution.width - 200) / 2,
			y: (resolution.height - 100) / 2,
			fill: "#000000",
			text: "Teksti",
			fontSize: 280,
		};
		addShape(text);
		selectShape(text.id);
		handleUpdate(true);
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
		<>
			<div className="flex p-2 sm:p-4 gap-2 sm:gap-4">
				<FilePicker addImage={addImage} />
				<Button onClick={addText}>
					<TextIcon className="size-5" /> Lisää teksti
				</Button>
			</div>
			<div
				ref={containerRef}
				className="bg-zinc-800 sm:rounded sm:mx-4 sm:mb-4"
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
					handleUpdate={() => handleUpdate(false)}
				/>
			</div>
			<div className="flex flex-col bg-zinc-900 gap-4 p-4 sm:p-4">
				{selectedShape && (
					<Controls
						shape={findShape(selectedShape)}
						removeSelected={removeSelected}
						updateShape={(s) => {
							updateShape(s);
							handleUpdate(true);
						}}
					/>
				)}
				<div className="flex">
					<button
						onClick={handleExport}
						disabled={shapes.length < 1}
						className="ml-auto flex items-center gap-2 px-4 py-2 rounded bg-primary-700 disabled:bg-zinc-800 font-medium text-sm"
					>
						<DownloadIcon className="size-5" />
						<span className="">Lataa</span>
					</button>
				</div>
			</div>
		</>
	);
};

export default Editor;
