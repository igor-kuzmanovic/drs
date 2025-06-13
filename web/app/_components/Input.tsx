import React from "react";
import clsx from "clsx";

type InputProps = {
	id: string;
	label?: React.ReactNode;
	labelClassName?: string;
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
	labelClassName = "",
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
				name={name || id}
				type={type}
				autoComplete={autoComplete}
				className={clsx(
					"w-full border px-3 py-2 focus:outline-none transition",
					"focus:bg-blue-50 focus:ring-2 focus:ring-blue-500",
					"disabled:opacity-50 disabled:cursor-not-allowed",
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
