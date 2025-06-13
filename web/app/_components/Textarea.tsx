import React from "react";
import clsx from "clsx";

type TextareaProps = {
	id: string;
	label: string;
	error?: string;
	disabled?: boolean;
	placeholder?: string;
	rows?: number;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	name?: string;
};

export default function Textarea({
	id,
	label,
	error,
	disabled = false,
	placeholder,
	rows = 3,
	value,
	onChange,
	name,
}: TextareaProps) {
	return (
		<div>
			<label htmlFor={id} className="block text-sm font-medium mb-1">
				{label}
			</label>
			<textarea
				id={id}
				name={name || id}
				rows={rows}
				placeholder={placeholder}
				className={clsx(
					"w-full border px-3 py-2 focus:outline-none transition",
					"focus:bg-blue-100 focus:ring-2 focus:ring-blue-500",
					disabled && "opacity-50 cursor-not-allowed",
				)}
				value={value}
				onChange={onChange}
				disabled={disabled}
			/>
			{error && <div className="text-red-600 text-xs mt-1">{error}</div>}
		</div>
	);
}
