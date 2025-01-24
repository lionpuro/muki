import { create } from "zustand";
import { ImageData } from "~/editor/shapes";

type ImageState = {
	images: ImageData[];
	imageSources: { id: string; src: string }[];
	setImages: (images: ImageData[]) => void;
	addImage: (i: ImageData) => void;
	deleteImage: (id: string) => void;
	updateImage: (props: ImageData) => void;
	findImage: (id: string) => ImageData | undefined;
};

export const useImageStore = create<ImageState>((set, get) => ({
	images: [],
	imageSources: [],
	setImages: (images: ImageData[]) => set(() => ({ images: images })),
	addImage: (image: ImageData) =>
		set((state) => ({
			images: [...state.images, image],
			imageSources: [...state.imageSources, { id: image.id, src: image.src }],
		})),
	deleteImage: (id: string) =>
		set((state) => ({
			images: state.images.filter((i) => i.id !== id),
			imageSources: state.imageSources.filter((src) => src.id !== id),
		})),
	updateImage: (props: ImageData) =>
		set((state) => ({
			images: state.images.map((img) => (img.id === props.id ? props : img)),
		})),
	findImage: (id: string) => get().images.find((img) => img.id === id),
}));
