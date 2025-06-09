import React from "react";
import clsx from "clsx";

type ButtonProps = {
	children: React.ReactNode;
	type?: "button" | "submit" | "reset";
	variant?: "primary" | "secondary";
	size?: "sm" | "md" | "lg";
	fullWidth?: boolean;
	loading?: boolean;
	disabled?: boolean;
	onClick?: () => void;
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
}: ButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled || loading}
			className={clsx(
				"flex items-center justify-center gap-2 rounded font-medium transition-colors",
				{
					"bg-blue-600 text-white hover:bg-blue-700": variant === "primary",
					"bg-gray-100 text-gray-700 hover:bg-gray-200":
						variant === "secondary",
					"px-3 py-1 text-sm": size === "sm",
					"px-4 py-2": size === "md",
					"px-6 py-3 text-lg": size === "lg",
					"w-full": fullWidth,
					"opacity-50 cursor-not-allowed": disabled,
					"relative !text-transparent": loading,
				},
			)}
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
