import clsx from "clsx";
import { PhotoIcon } from "~/lib/icons";

const FilePicker = ({
	submitImage,
}: {
	submitImage: (img: HTMLImageElement) => void;
}) => {
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
				submitImage(image);
			};
		};
	};

	return (
		<div className="flex">
			<label
				htmlFor="image-upload"
				className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-base-200 rounded-lg text-sm font-medium cursor-pointer hover:bg-base-100"
			>
				<PhotoIcon className="text-base" />
				Valitse kuva
			</label>
			<input
				id="image-upload"
				type="file"
				accept="image/*"
				onChange={handleChange}
				className={clsx(
					"hidden flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-sm",
				)}
			/>
		</div>
	);
};
export default FilePicker;
