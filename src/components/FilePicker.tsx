import { useState } from "react";
import { TbPhotoPlus as PhotoIcon } from "react-icons/tb";

const FilePicker = ({
	addImage,
}: {
	addImage: (img: HTMLImageElement) => void;
}) => {
	const [image, setImage] = useState<HTMLImageElement | null>(null);
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = (e: ProgressEvent<FileReader>) => {
			if (!(e.target instanceof FileReader)) {
				return;
			}
			if (!e.target.result) return;
			const src = e.target.result.toString();
			const image = new window.Image();
			image.src = src;
			image.onload = () => {
				image.width = image.naturalWidth;
				image.height = image.naturalHeight;
				setImage(image);
			};
		};
	};
	const [modalOpen, setModalOpen] = useState(false);

	const submit = () => {
		if (!image) return;
		addImage(image);
		setModalOpen(false);
	};
	return (
		<>
			<button
				onClick={() => setModalOpen(!modalOpen)}
				className="flex items-center gap-2 px-4 py-2 font-medium hover:text-primary-600 active:text-primary-600"
			>
				<PhotoIcon className="size-5" />
				Kuva
			</button>
			{modalOpen && (
				<div
					onClick={() => setModalOpen(false)}
					className="z-50 absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center"
				>
					<div
						onClick={(e) => e.stopPropagation()}
						className="flex flex-col w-full max-w-screen-sm bg-zinc-100 p-6 gap-4 rounded"
					>
						<h2 className="text-lg font-bold">Valitse kuva</h2>
						<input type="file" accept="image/*" onChange={handleChange} />
						<button
							onClick={submit}
							disabled={!image}
							className="w-fit px-4 py-2 disabled:bg-zinc-300 bg-primary-600 text-zinc-100 text-sm font-medium rounded"
						>
							Lisää kuva
						</button>
					</div>
				</div>
			)}
		</>
	);
};
export default FilePicker;
