import React from "react";
import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label?: React.ReactNode;
	labelClassName?: string;
	error?: string;
	inputSize?: "sm" | "md" | "lg";
	wrapperClassName?: string;
};

export default function Input({
	id,
	label,
	labelClassName = "",
	error,
	inputSize = "md",
	wrapperClassName = "",
	className = "",
	...rest
}: InputProps) {
	const sizeClasses =
		inputSize === "sm"
			? "px-3 py-1.5 text-sm"
			: inputSize === "lg"
				? "px-6 py-3 text-lg"
				: "px-4 py-2 text-base";

	return (
		<div className={wrapperClassName}>
			{label && (
				<label
					htmlFor={id}
					className={clsx("block text-sm font-medium mb-1", labelClassName)}
				>
					{label}
				</label>
			)}
			<input
				id={id}
				className={clsx(
					"w-full border focus:outline-none transition",
					"focus:bg-blue-50 focus:ring-2 focus:ring-blue-500",
					"disabled:opacity-50 disabled:cursor-not-allowed",
					sizeClasses,
					className,
				)}
				{...rest}
			/>
			{error && <div className="text-red-600 text-xs mt-1">{error}</div>}
		</div>
	);
}
