import React from "react";
import clsx from "clsx";

type InputProps = {
	id: string;
	label: string;
	error?: string;
	disabled?: boolean;
	placeholder?: string;
	type?: string;
	autoComplete?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	name?: string;
};

export default function Input({
	id,
	label,
	error,
	disabled = false,
	placeholder,
	type = "text",
	autoComplete,
	value,
	onChange,
	name,
}: InputProps) {
	return (
		<div>
			<label htmlFor={id} className="block text-sm font-medium mb-1">
				{label}
			</label>
			<input
				id={id}
				name={name || id}
				type={type}
				autoComplete={autoComplete}
				className={clsx(
					"w-full rounded border border-gray-300 px-3 py-2 focus:outline-none transition",
					"focus:bg-blue-100 focus:ring-2 focus:ring-blue-500",
					"hover:shadow",
					disabled && "opacity-50 cursor-not-allowed",
				)}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				disabled={disabled}
			/>
			{error && <div className="text-red-600 text-xs mt-1">{error}</div>}
		</div>
	);
}
