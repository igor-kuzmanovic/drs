import React from "react";
import clsx from "clsx";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label: string;
	error?: string;
	wrapperClassName?: string;
	labelClassName?: string;
};

export default function Checkbox({
	id,
	label,
	error,
	wrapperClassName = "",
	labelClassName = "",
	className = "",
	...rest
}: CheckboxProps) {
	return (
		<div className={wrapperClassName}>
			<div className="flex items-center gap-2">
				<input
					id={id}
					type="checkbox"
					className={clsx(
						"size-4 border transition focus:ring-2 focus:ring-blue-500",
						"checked:bg-blue-500 checked:border-blue-500",
						"disabled:cursor-not-allowed disabled:opacity-50",
						className,
					)}
					{...rest}
				/>
				<label
					htmlFor={id}
					className={clsx(
						"text-sm font-medium cursor-pointer select-none",
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
