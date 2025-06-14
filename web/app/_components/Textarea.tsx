import React from "react";
import clsx from "clsx";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	label?: string;
	error?: string;
	wrapperClassName?: string;
	labelClassName?: string;
};

export default function Textarea({
	id,
	label,
	error,
	wrapperClassName = "",
	labelClassName = "",
	className = "",
	readOnly,
	...rest
}: TextareaProps) {
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
			<textarea
				id={id}
				readOnly={readOnly}
				className={clsx(
					"w-full border px-4 py-2 text-base focus:outline-none transition",
					"focus:bg-blue-50 focus:ring-2 focus:ring-blue-500",
					"disabled:opacity-50 disabled:cursor-not-allowed",
					readOnly &&
						"bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed",
					className,
				)}
				{...rest}
			/>
			{error && <div className="text-red-600 text-xs mt-1">{error}</div>}
		</div>
	);
}
