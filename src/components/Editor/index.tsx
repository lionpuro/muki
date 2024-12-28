import { useRef, useState } from "react";
import Canvas from "~/components/Editor/Canvas";
import { ImageAttributes } from "~/components/Image";
import { nanoid } from "nanoid";
import FilePicker from "~/components/FilePicker";
import useCanvasSize from "~/hooks/useCanvasSize";
import { resolution } from "~/constants";
import clsx from "clsx";
import {
	TbTrash as TrashIcon,
	TbDownload as DownloadIcon,
} from "react-icons/tb";
import { Stage } from "konva/lib/Stage";
import { Transformer } from "konva/lib/shapes/Transformer";

const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
	return (
		<button
			className={
				"flex items-center gap-2 px-4 py-2 text-sm font-medium rounded bg-zinc-700 hover:bg-zinc-600"
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

const Editor = () => {
	const [images, setImages] = useState<ImageAttributes[]>([]);
	const [selectedImage, selectImage] = useState<string | null>(null);
	const { size, scale } = useCanvasSize();
	const stageRef = useRef<Stage>(null);
	const trRef = useRef<Transformer>(null);

	const removeSelected = () => {
		const imgs = [...images].filter((img) => img.id != selectedImage);
		setImages(imgs);
		trRef.current?.nodes([]);
		selectImage(null);
	};

	const addImage = (img: HTMLImageElement) => {
		const newImage: ImageAttributes = {
			id: nanoid(),
			src: img.src,
			width: img.width,
			height: img.height,
			x: (resolution.width - img.width) / 2,
			y: (resolution.height - img.height) / 2,
		};
		setImages([...images, newImage]);
		selectImage(newImage.id);
	};

	const handleExport = () => {
		trRef.current?.hide();
		const stage = stageRef.current;
		if (!stage) return;

		stage.width(resolution.width);
		stage.height(resolution.height);
		stage.scaleX(1);
		stage.scaleY(1);

		const uri = stage.toDataURL();
		downloadURI(uri, "muki.png");

		stage.width(size.width);
		stage.height(size.height);
		stage.scaleX(scale);
		stage.scaleY(scale);
		trRef.current?.show();
	};

	return (
		<>
			<Canvas
				stageRef={stageRef}
				trRef={trRef}
				size={size}
				scale={scale}
				images={images}
				setImages={setImages}
				selectedImage={selectedImage}
				selectImage={selectImage}
			/>
			<div className="flex flex-col bg-zinc-900 gap-4">
				<div className="flex gap-4">
					<FilePicker addImage={addImage} />
					<button
						onClick={handleExport}
						disabled={images.length < 1}
						className="flex items-center gap-2 px-4 py-2 rounded bg-primary-700 disabled:bg-zinc-800 font-medium"
					>
						<DownloadIcon className="size-5" /> Download
					</button>
				</div>
				<div className="flex gap-2">
					{images.map((img) => (
						<div key={`preview-${img.id}`}>
							<div
								onClick={() => selectImage(img.id)}
								className={clsx(
									"hover:cursor-pointer bg-zinc-800 border-2 rounded relative",
									{
										"border-blue-500": selectedImage === img.id,
										"border-zinc-700": selectedImage !== img.id,
									},
								)}
							>
								<img
									src={img.src}
									className="max-w-full h-auto max-h-28 flex-1"
								/>
							</div>
						</div>
					))}
				</div>
				{!!selectedImage && (
					<div className="flex gap-2">
						<Button onClick={removeSelected}>
							<TrashIcon className="size-5" />
							Delete
						</Button>
					</div>
				)}
			</div>
		</>
	);
};
export default Editor;
