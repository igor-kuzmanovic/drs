"use client";

import React from "react";
import clsx from "clsx";

type RadioProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label: string;
	error?: string;
	wrapperClassName?: string;
	labelClassName?: string;
};

export default function Radio({
	id,
	label,
	error,
	wrapperClassName = "",
	labelClassName = "",
	className = "",
	disabled,
	...rest
}: RadioProps) {
	type ColorStyle = {
		bg: string;
		border: string;
		radio: string;
	};

	const isYes = label === "Yes";
	const isNo = label === "No";
	const isCantAnswer = label === "Can't answer";

	const colorStyles: ColorStyle =
		isYes && rest.checked
			? {
					bg: "bg-blue-50",
					border: "border-blue-500",
					radio: "checked:border-blue-500",
				}
			: isNo && rest.checked
				? {
						bg: "bg-red-50",
						border: "border-red-500",
						radio: "checked:border-red-500",
					}
				: isCantAnswer && rest.checked
					? {
							bg: "bg-gray-50",
							border: "border-gray-500",
							radio: "checked:border-gray-500",
						}
					: {
							bg: "bg-blue-50",
							border: "border-blue-500",
							radio: "checked:border-blue-500",
						};

	return (
		<div className={clsx("mb-3", wrapperClassName)}>
			<div
				className={clsx(
					"flex items-center p-3 border transition-all",
					isYes
						? "hover:bg-blue-50"
						: isNo
							? "hover:bg-red-50"
							: "hover:bg-gray-50",
					rest.checked
						? `${colorStyles.bg} ${colorStyles.border} shadow-sm`
						: "border-gray-300",
					disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
				)}
			>
				<div className="relative flex items-center justify-center">
					<input
						type="radio"
						id={id}
						disabled={disabled}
						className={clsx(
							"size-5 border transition appearance-none rounded-full",
							colorStyles.radio,
							"checked:border-[6px]",
							"focus:outline-none focus:ring-2 focus:ring-offset-2",
							isYes
								? "focus:ring-blue-500"
								: isNo
									? "focus:ring-red-500"
									: "focus:ring-gray-500",
							"disabled:cursor-not-allowed disabled:opacity-50",
							className,
						)}
						{...rest}
					/>
				</div>
				<label
					htmlFor={id}
					className={clsx(
						"ml-3 text-base font-medium select-none flex-1",
						disabled
							? "text-gray-400 cursor-not-allowed"
							: "text-gray-900 cursor-pointer",
						labelClassName,
					)}
				>
					{label}
				</label>
			</div>
			{error && <div className="text-red-600 text-xs mt-1">{error}</div>}
		</div>
	);
}
