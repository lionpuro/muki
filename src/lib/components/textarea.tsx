import clsx from "clsx";
import { forwardRef, TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className = "", ...props }, ref) => (
		<textarea
			ref={ref}
			className={clsx("w-full py-1 px-3 bg-base-white rounded-lg", className)}
			style={{ resize: "none" }}
			{...props}
		/>
	),
);
