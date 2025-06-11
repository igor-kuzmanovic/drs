import React from "react";
import clsx from "clsx";
import Link from "next/link";

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
		"rounded flex items-center justify-center gap-2 font-medium transition-colors relative",
		{
			"text-sm": size === "sm",
			"text-base": size === "md",
			"text-lg": size === "lg",
			"px-3 py-1": size === "sm",
			"px-4 py-2": size === "md",
			"px-6 py-3": size === "lg",
			"w-full": fullWidth,
			"bg-sky-600 text-white": variant === "primary" && !disabled && !loading,
			"bg-gray-100 text-gray-700":
				variant === "secondary" && !disabled && !loading,
			"bg-red-600 text-white": variant === "danger" && !disabled && !loading,
			"opacity-50 cursor-not-allowed": disabled || loading,
			"!text-transparent": loading,
		},
		className,
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
				{loading && (
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
					</div>
				)}
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
			{loading && (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
				</div>
			)}
			{children}
		</button>
	);
}
