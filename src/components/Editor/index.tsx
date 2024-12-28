import { useState } from "react";
import Canvas from "~/components/Editor/Canvas";
import { ImageAttributes } from "~/components/Image";
import { nanoid } from "nanoid";
import FilePicker from "~/components/FilePicker";
import useCanvasSize from "~/hooks/useCanvasSize";
import { resolution } from "~/constants";
import clsx from "clsx";
import { TbTrash as TrashIcon } from "react-icons/tb";

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

const Editor = () => {
	const [images, setImages] = useState<ImageAttributes[]>([]);
	const [selectedImage, selectImage] = useState<string | null>(null);
	const { size, scale } = useCanvasSize();

	const removeSelected = () => {
		const imgs = [...images].filter((img) => img.id != selectedImage);
		setImages(imgs);
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

	return (
		<>
			<Canvas
				size={size}
				scale={scale}
				images={images}
				setImages={setImages}
				selectedImage={selectedImage}
				selectImage={selectImage}
			/>
			<div className="flex flex-col bg-zinc-900 gap-4">
				<div className="flex">
					<FilePicker addImage={addImage} />
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
