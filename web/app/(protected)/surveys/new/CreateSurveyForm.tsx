"use client";

import React from "react";
import Input from "../../../_components/Input";
import Textarea from "../../../_components/Textarea";
import Action from "../../../_components/Action";
import Checkbox from "../../../_components/Checkbox";
import Alert from "../../../_components/Alert";
import EmailChips from "../../../_components/EmailChips";
import { useForm } from "../../../_hooks/useForm";
import SurveyService from "../../../_lib/survey";
import { TOAST_TYPES, useToast } from "../../../_context/ToastContext";
import { useHealth } from "../../../_context/HealthContext";
import { SERVICE_TYPES } from "../../../_lib/health";

type FormValues = {
	name: string;
	question: string;
	endDate: string;
	recipients: string[];
	isAnonymous: boolean;
};

export default function CreateSurveyForm({
	onSuccess,
	onCancel,
	disabled = false,
}: {
	onSuccess: () => void;
	onCancel: () => void;
	disabled?: boolean;
}) {
	const { showToast } = useToast();
	const { isSurveyServiceHealthy } = useHealth();

	const {
		values,
		formErrors,
		loading,
		error,
		handleChange,
		handleSubmit,
		setValue,
	} = useForm<FormValues>({
		initialValues: {
			name: "",
			question: "",
			endDate: "",
			recipients: [],
			isAnonymous: false,
		},
		validate: (values: FormValues) => {
			const errors: Record<string, string> = {};
			if (!values.name) errors.name = "Name is required";
			if (!values.question) errors.question = "Question is required";
			if (!values.endDate) {
				errors.endDate = "End date is required";
			} else {
				const selected = new Date(values.endDate).getTime();
				const now = Date.now();
				if (selected < now) {
					errors.endDate = "End date cannot be in the past";
				}
			}
			if (values.recipients.length === 0) {
				errors.recipients = "At least one recipient is required";
			} else if (values.recipients.length > 50) {
				errors.recipients = "Maximum 50 recipients are allowed";
			}
			return errors;
		},
		onSubmit: async (values) => {
			await SurveyService.createSurvey({
				name: values.name,
				question: values.question,
				endDate: new Date(values.endDate).toISOString(),
				isAnonymous: values.isAnonymous,
				recipients: values.recipients,
			});

			showToast("Survey created successfully", TOAST_TYPES.SUCCESS);
			onSuccess();
		},
	});

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
					disabled={loading || disabled || !isSurveyServiceHealthy}
					error={formErrors.name}
				/>
				<Textarea
					id="question"
					name="question"
					label="Question"
					placeholder="Enter your survey question"
					value={values.question}
					onChange={handleChange}
					disabled={loading || disabled || !isSurveyServiceHealthy}
					error={formErrors.question}
				/>
				<Input
					id="endDate"
					name="endDate"
					label="End Date"
					type="datetime-local"
					value={values.endDate}
					onChange={handleChange}
					disabled={loading || disabled || !isSurveyServiceHealthy}
					error={formErrors.endDate}
				/>
				<EmailChips
					value={values.recipients}
					onChange={(recipients) => setValue("recipients", recipients)}
					disabled={loading || disabled || !isSurveyServiceHealthy}
					error={formErrors.recipients}
					label="Recipients"
				/>
				<Checkbox
					id="isAnonymous"
					name="isAnonymous"
					label="Make survey anonymous"
					checked={values.isAnonymous}
					onChange={handleChange}
					disabled={loading || disabled || !isSurveyServiceHealthy}
				/>
			</div>
			<div className="flex justify-end gap-4">
				<Action
					type="button"
					variant="secondary"
					disabled={loading || disabled || !isSurveyServiceHealthy}
					onClick={onCancel}
				>
					Cancel
				</Action>
				<Action
					type="submit"
					loading={loading}
					disabled={disabled || !isSurveyServiceHealthy}
					requiredService={
						!isSurveyServiceHealthy ? SERVICE_TYPES.SURVEY : undefined
					}
					disabledMessage="Survey creation is currently unavailable"
				>
					Create Survey
				</Action>
			</div>
			{Object.keys(formErrors).length > 0 && (
				<Alert type="error">Please correct the errors above.</Alert>
			)}
			{error && Object.keys(formErrors).length === 0 && (
				<Alert type="error">{error}</Alert>
			)}
		</form>
	);
}
