import { useState } from "react";
import { MdPhoto as PhotoIcon } from "react-icons/md";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/lib/components/dialog";

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
	const [isOpen, setIsOpen] = useState(false);

	const submit = () => {
		if (!image) return;
		addImage(image);
		setIsOpen(false);
	};
	return (
		<>
			<Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
				<DialogTrigger className="flex items-center gap-2 p-2 hover:text-primary-600 active:text-primary-600 text-sm font-semibold">
					<PhotoIcon className="size-5" />
					Kuva
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Valitse kuva</DialogTitle>
						<DialogDescription visuallyHidden>Valitse kuva</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-4">
						<input type="file" accept="image/*" onChange={handleChange} />
						<button
							onClick={submit}
							disabled={!image}
							className="w-fit px-4 py-2 disabled:bg-base-400 bg-primary-500 hover:bg-primary-600 text-base-50 text-sm font-semibold rounded-md"
						>
							Lisää kuva
						</button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
export default FilePicker;
