"use client";

import { useRef, useState, useEffect } from "react";
import Input from "../../_components/Input";
import Radio from "../../_components/Radio";
import Action from "../../_components/Action";
import Alert from "../../_components/Alert";
import { useForm } from "../../_hooks/useForm";
import { useToast } from "../../_context/ToastContext";
import SurveyService from "../../_lib/survey";
import { SurveyAnswer, SurveyAnswerType } from "../../_lib/models";

export function SurveyRespondForm({
	surveyId,
	isAnonymous,
	prefillEmail = "",
	prefillAnswer = "",
	token = "",
}: {
	surveyId: string;
	isAnonymous: boolean;
	prefillEmail?: string;
	prefillAnswer?: string;
	token?: string;
}) {
	const effectiveEmail = prefillEmail;
	const [submitted, setSubmitted] = useState(false);
	const autoSubmitted = useRef(false);
	const { showToast } = useToast();

	const initialValues = {
		email: effectiveEmail,
		answer: (prefillAnswer as SurveyAnswerType) || "",
	};

	const { values, error, loading, handleSubmit, setValue } = useForm({
		initialValues,
		validate: (values) => {
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
					await SurveyService.respondSurvey(surveyId, {
						token,
						answer: values.answer as SurveyAnswerType,
					});
				} else {
					await SurveyService.respondSurvey(surveyId, {
						email: values.email,
						answer: values.answer as SurveyAnswerType,
					});
				}

				showToast("Thank you for your response!", "success");
				setSubmitted(true);
			} catch (err) {
				if (err instanceof Error && err.message === "Already responded") {
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
			(values.answer === SurveyAnswer.Yes ||
				values.answer === SurveyAnswer.No ||
				values.answer === SurveyAnswer.CantAnswer) &&
			!submitted &&
			!autoSubmitted.current
		) {
			autoSubmitted.current = true;
			handleSubmit(new Event("submit") as unknown as React.FormEvent);
		}
		// eslint-disable-next-line
	}, [token, values.answer]);

	const isDisabled = loading || submitted;

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
				/>
			)}
			<div className="flex flex-col gap-2">
				<Radio
					id="answer-yes"
					name="answer"
					label="Yes"
					value={SurveyAnswer.Yes}
					checked={values.answer === SurveyAnswer.Yes}
					onChange={() => setValue("answer", SurveyAnswer.Yes)}
					disabled={isDisabled || !!prefillAnswer}
				/>
				<Radio
					id="answer-no"
					name="answer"
					label="No"
					value={SurveyAnswer.No}
					checked={values.answer === SurveyAnswer.No}
					onChange={() => setValue("answer", SurveyAnswer.No)}
					disabled={isDisabled || !!prefillAnswer}
				/>
				<Radio
					id="answer-cant"
					name="answer"
					label="Can't answer"
					value={SurveyAnswer.CantAnswer}
					checked={values.answer === SurveyAnswer.CantAnswer}
					onChange={() => setValue("answer", SurveyAnswer.CantAnswer)}
					disabled={isDisabled || !!prefillAnswer}
				/>
			</div>
			<Action
				type="submit"
				fullWidth
				loading={loading}
				disabled={isDisabled || !!prefillAnswer}
			>
				Submit
			</Action>
			{error && <Alert type="error">{error}</Alert>}
		</form>
	);
}
