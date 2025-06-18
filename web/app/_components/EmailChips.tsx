"use client";

import React, { useState } from "react";

function validateEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function EmailChips({
	value,
	onChange,
	disabled,
	error,
	label,
}: {
	value: string[];
	onChange: (emails: string[]) => void;
	disabled?: boolean;
	error?: string;
	label?: string;
}) {
	const [input, setInput] = useState("");
	const [inputError, setInputError] = useState<string | null>(null);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
		setInputError(null);
	};

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (
			(e.key === "Enter" ||
				e.key === " " ||
				e.key === "," ||
				e.key === "Tab") &&
			input.trim()
		) {
			e.preventDefault();
			addEmail(input.trim().replace(/,$/, ""));
		}
	};

	const addEmail = (email: string) => {
		if (!validateEmail(email)) {
			setInputError("Invalid email");
			return;
		}
		if (value.includes(email)) {
			setInputError("Duplicate email");
			return;
		}
		onChange([...value, email]);
		setInput("");
		setInputError(null);
	};

	const removeEmail = (email: string) => {
		onChange(value.filter((e) => e !== email));
	};

	return (
		<div>
			{label && (
				<label className="block text-sm font-medium mb-1">{label}</label>
			)}
			<div className="flex flex-wrap items-center gap-2 border p-2 bg-white">
				{value.map((email) => (
					<span
						key={email}
						className="bg-blue-100 text-blue-800 px-2 py-1 flex items-center text-xs"
					>
						{email}
						<button
							type="button"
							className="ml-1 text-blue-500 hover:text-red-500"
							onClick={() => removeEmail(email)}
							disabled={disabled}
							aria-label={`Remove ${email}`}
						>
							×
						</button>
					</span>
				))}
				<input
					type="text"
					value={input}
					onChange={handleInputChange}
					onKeyDown={handleInputKeyDown}
					placeholder="Add email"
					className="flex-1 min-w-[120px] outline-none border-none bg-transparent text-sm"
					disabled={disabled}
				/>
			</div>
			<div className="flex justify-between mt-1">
				{(inputError || error) && (
					<div className="text-red-600 text-xs">{inputError || error}</div>
				)}
				<div className="text-xs text-gray-500 ml-auto">
					{value.length} {value.length === 1 ? "recipient" : "recipients"}
				</div>
			</div>
		</div>
	);
}
