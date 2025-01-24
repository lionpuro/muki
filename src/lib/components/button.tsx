import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

const styles = {
	base: "flex justify-center items-center rounded-lg gap-2",
	variant: {
		primary: "bg-primary-500 hover:bg-primary-600 text-base-white",
		secondary: "bg-base-500 hover:bg-base-600 text-base-white",
		black: "bg-base-900 hover:bg-base-800 text-base-white",
		outline: "border border-base-200 hover:bg-base-100 text-base-900",
	},
	disabled: "bg-base-200 text-base-500",
	size: {
		sm: "py-2 px-3 text-sm font-semibold",
		md: "py-2 px-5 font-medium",
		icon: "size-10 flex items-center justify-center",
	},
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: keyof typeof styles.variant;
	size?: keyof typeof styles.size;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			size = "md",
			variant = "primary",
			className,
			type = "button",
			children,
			...props
		},
		ref,
	) => {
		const classes = clsx(
			styles.base,
			styles.size[size],
			props.disabled ? styles.disabled : styles.variant[variant],
			className,
		);
		return (
			<button ref={ref} type={type} className={classes} {...props}>
				{children}
			</button>
		);
	},
);
