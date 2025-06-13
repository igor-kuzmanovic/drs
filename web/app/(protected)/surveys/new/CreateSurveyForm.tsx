"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { printError } from "../../../_lib/error";
import Input from "../../../_components/Input";
import Textarea from "../../../_components/Textarea";
import Button from "../../../_components/Button";
import Checkbox from "../../../_components/Checkbox";
import { createSurvey } from "../../../_lib/api";
import Alert from "../../../_components/Alert";

type FormValues = {
	name: string;
	question: string;
	endDate: string;
	recipients: string;
	isAnonymous: boolean;
};

const initialValues: FormValues = {
	name: "",
	question: "",
	endDate: "",
	recipients: "",
	isAnonymous: false,
};

export default function CreateSurveyForm() {
	const router = useRouter();
	const [values, setValues] = useState<FormValues>(initialValues);
	const [errors, setErrors] = useState<Partial<FormValues>>({});
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const validate = (vals: FormValues) => {
		const errs: Partial<FormValues> = {};
		if (vals.name.length === 0) errs.name = "Name is required";
		if (vals.question.length === 0) errs.question = "Question is required";
		if (!vals.endDate) {
			errs.endDate = "End date is required";
		} else {
			const selected = new Date(vals.endDate).getTime();
			const now = Date.now();
			if (selected < now) {
				errs.endDate = "End date cannot be in the past";
			}
		}

		const recipientList = vals.recipients
			.split(",")
			.map((email) => email.trim())
			.filter((email) => email.length > 0);

		if (recipientList.length === 0) {
			errs.recipients = "At least one recipient is required";
		} else if (recipientList.length > 50) {
			errs.recipients = "Maximum 50 recipients are allowed";
		}

		return errs;
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const value =
			e.target.type === "checkbox"
				? (e.target as HTMLInputElement).checked
				: e.target.value;

		setValues({ ...values, [e.target.name]: value });
		setErrors({ ...errors, [e.target.name]: undefined });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		const validationErrors = validate(values);
		setErrors(validationErrors);
		if (Object.keys(validationErrors).length > 0) return;

		const recipients = values.recipients
			.split(",")
			.map((email) => email.trim())
			.filter((email) => email.length > 0);

		setLoading(true);
		try {
			await createSurvey({
				name: values.name,
				question: values.question,
				endDate: new Date(values.endDate).toISOString(),
				isAnonymous: values.isAnonymous,
				recipients,
			});
			router.push("/");
		} catch (err) {
			setError(printError(err));
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			className="flex flex-col gap-6 w-full max-w-2xl mx-auto"
			onSubmit={handleSubmit}
			noValidate
		>
			<div className="flex flex-col gap-4">
				<Input
					id="name"
					name="name"
					label="Survey Name"
					placeholder="Enter survey name"
					value={values.name}
					onChange={handleChange}
					disabled={loading}
					error={errors.name}
				/>
				<Textarea
					id="question"
					name="question"
					label="Question"
					placeholder="Enter your survey question"
					value={values.question}
					onChange={handleChange}
					disabled={loading}
					error={errors.question}
				/>
				<Input
					id="endDate"
					name="endDate"
					label="End Date"
					type="datetime-local"
					value={values.endDate}
					onChange={handleChange}
					disabled={loading}
					error={errors.endDate}
				/>
				<Textarea
					id="recipients"
					name="recipients"
					label="Recipients (comma-separated emails)"
					placeholder="email1@example.com, email2@example.com"
					value={values.recipients}
					onChange={handleChange}
					disabled={loading}
					error={errors.recipients}
				/>
				<Checkbox
					id="isAnonymous"
					name="isAnonymous"
					label="Make survey anonymous"
					checked={values.isAnonymous}
					onChange={handleChange}
					disabled={loading}
				/>
			</div>
			<div className="flex justify-end gap-4">
				<Button
					type="button"
					variant="secondary"
					disabled={loading}
					onClick={() => router.push("/surveys")}
				>
					Cancel
				</Button>
				<Button type="submit" loading={loading}>
					Create Survey
				</Button>
			</div>
			{error && <Alert type="error">{error}</Alert>}
		</form>
	);
}
