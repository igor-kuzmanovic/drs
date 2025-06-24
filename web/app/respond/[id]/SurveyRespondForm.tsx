"use client";

import { useRef, useState, useEffect } from "react";
import Input from "../../_components/Input";
import Radio from "../../_components/Radio";
import Action from "../../_components/Action";
import Alert from "../../_components/Alert";
import { useForm } from "../../_hooks/useForm";
import { CheckCircle } from "lucide-react";
import { TOAST_TYPES, useToast } from "../../_context/ToastContext";
import { useHealth } from "../../_context/HealthContext";
import SurveyService from "../../_lib/survey";
import { SURVEY_ANSWER, SurveyAnswerType } from "../../_lib/models";
import { SERVICE_TYPES } from "../../_lib/health";
import { printError } from "../../_lib/error";

type FormValues = {
	email: string;
	answer: SurveyAnswerType | "";
};

export function SurveyRespondForm({
	surveyId,
	isAnonymous,
	prefillEmail = "",
	prefillAnswer = "",
	token = "",
	disabled = false,
}: {
	surveyId: string;
	isAnonymous: boolean;
	prefillEmail?: string;
	prefillAnswer?: string;
	token?: string;
	disabled?: boolean;
}) {
	const effectiveEmail = prefillEmail;
	const [submitted, setSubmitted] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const autoSubmitted = useRef(false);
	const { showToast } = useToast();
	const { isSurveyServiceHealthy } = useHealth();

	const { values, formErrors, loading, error, handleSubmit, setValue } =
		useForm<FormValues>({
			initialValues: {
				email: effectiveEmail,
				answer: (prefillAnswer as SurveyAnswerType) || "",
			},
			validate: (values: FormValues) => {
				const errors: Record<string, string> = {};
				if (!isAnonymous && !token && !values.email) {
					errors.email = "Email is required.";
				}
				if (!values.answer) {
					errors.answer = "Please select an answer.";
				}
				return errors;
			},
			onSubmit: async (values) => {
				try {
					if (token) {
						await SurveyService.postSurveyResponse(surveyId, {
							token,
							answer: values.answer as SurveyAnswerType,
						});
					} else {
						await SurveyService.postSurveyResponse(surveyId, {
							email: values.email,
							answer: values.answer as SurveyAnswerType,
						});
					}

					setSuccessMessage("Thank you for your response!");
					setSubmitted(true);
				} catch (err) {
					if (err instanceof Error && err.message === "Already responded") {
						setSuccessMessage("You have already responded to this survey.");
						setSubmitted(true);
					} else {
						throw err;
					}
				}
			},
		});

	// Auto-submit only if token and answer are present
	useEffect(() => {
		if (
			token &&
			(values.answer === SURVEY_ANSWER.YES ||
				values.answer === SURVEY_ANSWER.NO ||
				values.answer === SURVEY_ANSWER.CANT_ANSWER) &&
			!submitted &&
			!autoSubmitted.current
		) {
			autoSubmitted.current = true;
			handleSubmit(new Event("submit") as unknown as React.FormEvent);
		}
		// eslint-disable-next-line
	}, [token, values.answer]);

	const isDisabled =
		loading || submitted || disabled || !isSurveyServiceHealthy;

	if (submitted && successMessage) {
		return (
			<div className="flex flex-col items-center justify-center py-8 px-4">
				<div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-md w-full max-w-md">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<CheckCircle className="h-8 w-8 text-green-500" />
						</div>
						<div className="ml-3">
							<h3 className="text-lg font-medium text-green-800">Success!</h3>
							<div className="mt-2 text-green-700">{successMessage}</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-6 w-full max-w-md mx-auto"
		>
			{/* Hide email field if token exists */}
			{!isAnonymous && !token && (
				<Input
					id="email"
					label="Your email"
					type="email"
					autoComplete="email"
					placeholder="you@email.com"
					value={values.email}
					onChange={(e) => setValue("email", e.target.value)}
					disabled={isDisabled}
					readOnly={!!effectiveEmail}
					error={formErrors.email}
				/>
			)}
			<div className="flex flex-col">
				<h3 className="text-base font-medium text-gray-700 mb-2">
					Your answer:
				</h3>
				<div className="space-y-1">
					<Radio
						id="answer-yes"
						name="answer"
						label="Yes"
						value={SURVEY_ANSWER.YES}
						checked={values.answer === SURVEY_ANSWER.YES}
						onChange={() => setValue("answer", SURVEY_ANSWER.YES)}
						disabled={isDisabled || !!prefillAnswer}
					/>
					<Radio
						id="answer-no"
						name="answer"
						label="No"
						value={SURVEY_ANSWER.NO}
						checked={values.answer === SURVEY_ANSWER.NO}
						onChange={() => setValue("answer", SURVEY_ANSWER.NO)}
						disabled={isDisabled || !!prefillAnswer}
					/>
					<Radio
						id="answer-cant"
						name="answer"
						label="Can't answer"
						value={SURVEY_ANSWER.CANT_ANSWER}
						checked={values.answer === SURVEY_ANSWER.CANT_ANSWER}
						onChange={() => setValue("answer", SURVEY_ANSWER.CANT_ANSWER)}
						disabled={isDisabled || !!prefillAnswer}
					/>
					{formErrors.answer && (
						<div className="text-red-600 text-xs mt-1">{formErrors.answer}</div>
					)}
				</div>
			</div>
			<Action
				type="submit"
				fullWidth
				loading={loading}
				disabled={isDisabled || !!prefillAnswer}
				requiredService={
					!isSurveyServiceHealthy ? SERVICE_TYPES.SURVEY : undefined
				}
				disabledMessage="Survey response submission is currently unavailable"
			>
				Submit
			</Action>
			{Object.keys(formErrors).length > 0 && (
				<Alert type="error">Please correct the errors above.</Alert>
			)}
			{error && Object.keys(formErrors).length === 0 && (
				<Alert type="error">{error}</Alert>
			)}
		</form>
	);
}
