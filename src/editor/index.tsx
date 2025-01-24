import { useCallback, useContext, useRef } from "react";
import Canvas from "~/editor/canvas";
import useTextures from "~/hooks/useTextures";
import useResize from "~/hooks/useResize";
import { Controls } from "~/controls";
import { Toolbar } from "~/controls/toolbar";
import {
	ImageComponent,
	ImageData,
	SelectedShape,
	TextComponent,
	TextData,
} from "~/editor/shapes";
import useMobile from "~/hooks/useMobile";
import { StageContext } from "~/context/StageContext";
import { useImageStore } from "~/store/useImageStore";
import { useSelectionStore } from "~/store/useSelectionStore";
import { useTextStore } from "~/store/useTextStore";
import clsx from "clsx";
import { CheckCircleIcon } from "~/lib/icons";

const Editor = () => {
	const { layerRef, trRef } = useContext(StageContext);

	const images = useImageStore((state) => state.images);
	const updateImage = useImageStore((state) => state.updateImage);

	const imageSources = useImageStore((state) => state.imageSources);

	const texts = useTextStore((state) => state.texts);
	const updateText = useTextStore((state) => state.updateText);

	const selectedShape = useSelectionStore((state) => state.selected);
	const selectShape = useSelectionStore((state) => state.setSelected);

	const containerRef = useRef<HTMLDivElement>(null);
	const { size, scale } = useResize(containerRef);

	const { isMobile } = useMobile();

	const { update } = useTextures();
	const updateTexture = useCallback(() => {
		update(layerRef);
	}, [layerRef, update]);

	const onImageChange = (props: ImageData) => {
		updateImage(props);
		updateTexture();
	};
	const onTextChange = (props: TextData) => {
		updateText(props);
		updateTexture();
	};

	const setTexts = useTextStore((state) => state.setTexts);
	const setImages = useImageStore((state) => state.setImages);
	const onSelect = (target: SelectedShape) => {
		const trNode = trRef.current?.getNodes()[0];
		if (trNode?.attrs.id === target.id) {
			return;
		}
		if (target.type === "image") {
			const shape = images.find((img) => img.id === target.id);
			if (!shape) return;
			const filtered = images.filter((img) => img.id !== target.id);
			setImages([...filtered, shape]);
		} else if (target.type === "text") {
			const shape = texts.find((txt) => txt.id === target.id);
			if (!shape) return;
			const filtered = texts.filter((txt) => txt.id !== target.id);
			setTexts([...filtered, shape]);
		}
		selectShape({ id: target.id, type: target.type });
	};

	return (
		<>
			<div className={`flex flex-col`}>
				<div
					ref={containerRef}
					className={`
						rounded-lg bg-base-white overflow-hidden
						min-h-[calc(calc(100vw-24px)*0.41657848324)]
					`}
				>
					<Canvas size={size} scale={scale} updateTexture={updateTexture}>
						{images.map((img) => (
							<ImageComponent
								key={img.id}
								props={img}
								onSelect={() => onSelect({ id: img.id, type: img.type })}
								onChange={onImageChange}
								onLoad={updateTexture}
							/>
						))}
						{texts.map((txt) => (
							<TextComponent
								key={txt.id}
								props={txt}
								onSelect={() => onSelect({ id: txt.id, type: txt.type })}
								onChange={onTextChange}
								onLoad={updateTexture}
							/>
						))}
					</Canvas>
				</div>
			</div>

			{!isMobile && <Toolbar />}
			<Controls />
			<div className="flex flex-col gap-3 mt-auto">
				{selectedShape?.type !== "text" && imageSources.length > 0 && (
					<div className="flex overflow-x-auto gap-2 content-start">
						{imageSources.map((img) => (
							<div
								key={`src-${img.id}`}
								onClick={() => onSelect({ id: img.id, type: "image" })}
								className="flex relative size-16 aspect-square"
							>
								<img
									src={img.src}
									className="object-cover w-full h-full rounded-md border border-base-300"
								/>
								<span
									className={clsx(
										"absolute bottom-1 right-1",
										selectedShape?.id !== img.id && "hidden",
									)}
								>
									<CheckCircleIcon className="rounded-full size-6 bg-base-white text-primary-500" />
								</span>
							</div>
						))}
					</div>
				)}
			</div>
			{isMobile && <Toolbar />}
		</>
	);
};

export default Editor;
