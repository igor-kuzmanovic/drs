import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { Loader } from "lucide-react";

type ButtonProps = {
	children: React.ReactNode;
	type?: "button" | "submit" | "reset";
	variant?: "primary" | "secondary" | "danger";
	size?: "sm" | "md" | "lg";
	fullWidth?: boolean;
	loading?: boolean;
	disabled?: boolean;
	onClick?: () => void;
	href?: string;
	className?: string;
};

export default function Button({
	children,
	type = "button",
	variant = "primary",
	size = "md",
	fullWidth = false,
	loading = false,
	disabled = false,
	onClick,
	href,
	className = "",
}: ButtonProps) {
	const classes = clsx(
		"border flex items-center justify-center gap-2 font-medium transition-colors relative",
		{
			"text-sm": size === "sm",
			"text-base": size === "md",
			"text-lg": size === "lg",
			"px-3 py-1.5": size === "sm",
			"px-4 py-2": size === "md",
			"px-6 py-3": size === "lg",
			"w-full": fullWidth,
			"bg-blue-600 text-white border-blue-600":
				variant === "primary" && !disabled && !loading,
			"hover:bg-blue-700": variant === "primary" && !disabled && !loading,
			"bg-white text-gray-700":
				variant === "secondary" && !disabled && !loading,
			"hover:bg-gray-100": variant === "secondary" && !disabled && !loading,
			"bg-red-600 text-white border-red-600":
				variant === "danger" && !disabled && !loading,
			"hover:bg-red-700": variant === "danger" && !disabled && !loading,
			"opacity-50 cursor-not-allowed": disabled || loading,
			"cursor-pointer": !disabled && !loading,
		},
		className,
	);

	const spinner = (
		<Loader className="w-5 h-5 animate-spin mr-2" aria-label="Loading" />
	);

	if (href) {
		return (
			<Link
				href={href}
				className={classes}
				tabIndex={disabled ? -1 : 0}
				aria-disabled={disabled || loading}
				onClick={(e) => {
					if (disabled || loading) {
						e.preventDefault();
					}
				}}
			>
				{loading && spinner}
				{children}
			</Link>
		);
	}

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled || loading}
			className={classes}
		>
			{loading && spinner}
			{children}
		</button>
	);
}
