import React from "react";
import clsx from "clsx";

type RadioProps = {
	id: string;
	label: string;
	disabled?: boolean;
	checked: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	name?: string;
	value?: string;
	error?: string;
};

export default function Radio({
	id,
	label,
	disabled = false,
	checked,
	onChange,
	name,
	value,
	error,
}: RadioProps) {
	return (
		<div>
			<div className="flex items-center gap-2">
				<input
					type="radio"
					id={id}
					name={name || id}
					value={value}
					checked={checked}
					disabled={disabled}
					onChange={onChange}
					className={clsx(
						"size-4 rounded-full border border-gray-300 transition focus:ring-2 focus:ring-blue-500",
						"checked:bg-blue-500 checked:border-blue-500",
						"disabled:cursor-not-allowed disabled:opacity-50",
					)}
				/>
				<label
					htmlFor={id}
					className="text-sm font-medium cursor-pointer select-none"
				>
					{label}
				</label>
			</div>
			{error && <div className="text-red-600 text-xs mt-1">{error}</div>}
		</div>
	);
}
