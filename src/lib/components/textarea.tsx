import clsx from "clsx";
import { TextareaHTMLAttributes } from "react";

export const Textarea = ({
	className = "",
	...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
	<textarea
		className={clsx(
			"w-full py-1 px-3 bg-base-white border border-base-200 rounded-md",
			className,
		)}
		style={{ resize: "none" }}
		{...props}
	/>
);
