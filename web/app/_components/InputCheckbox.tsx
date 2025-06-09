import React from "react";

type InputCheckboxProps = {
	id: string;
	label: string;
	error?: string;
	disabled?: boolean;
	checked: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	name?: string;
};

export default function InputCheckbox({
	id,
	label,
	error,
	disabled = false,
	checked,
	onChange,
	name,
}: InputCheckboxProps) {
	return (
		<div>
			<div className="flex items-center gap-2">
				<input
					type="checkbox"
					id={id}
					name={name || id}
					className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
					checked={checked}
					onChange={onChange}
					disabled={disabled}
				/>
				<label htmlFor={id} className="text-sm font-medium">
					{label}
				</label>
			</div>
			{error && <div className="text-red-600 text-xs mt-1">{error}</div>}
		</div>
	);
}
