"use client";

import { useRef, useState, useEffect } from "react";
import Input from "../../_components/Input";
import Radio from "../../_components/Radio";
import Action from "../../_components/Action";
import Alert from "../../_components/Alert";
import { respondSurvey, SurveyAnswer, SurveyAnswerType } from "../../_lib/api";
import { printError } from "../../_lib/error";

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
	const [email, setEmail] = useState(effectiveEmail);
	const [answer, setAnswer] = useState<SurveyAnswerType | "">(
		(prefillAnswer as SurveyAnswerType) || "",
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [submitted, setSubmitted] = useState(false);
	const autoSubmitted = useRef(false);

	// Auto-submit only if token and answer are present
	useEffect(() => {
		if (
			token &&
			(answer === SurveyAnswer.Yes ||
				answer === SurveyAnswer.No ||
				answer === SurveyAnswer.CantAnswer) &&
			!submitted &&
			!autoSubmitted.current
		) {
			autoSubmitted.current = true;
			handleSubmit();
		}
		// eslint-disable-next-line
	}, [token, answer]);

	const handleSubmit = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		setError(null);
		setSuccess(null);

		if (!isAnonymous && !token && !email) {
			setError("Email is required.");
			return;
		}
		if (!answer) {
			setError("Please select an answer.");
			return;
		}

		setLoading(true);
		try {
			await respondSurvey(
				surveyId,
				token
					? { token, answer: answer as SurveyAnswerType }
					: { email, answer: answer as SurveyAnswerType },
			);
			setSuccess("Thank you for your response!");
			setSubmitted(true);
		} catch (err) {
			const msg = printError(err);
			setError(msg);
			if (msg === "Already responded") {
				setSubmitted(true);
			}
		} finally {
			setLoading(false);
		}
	};

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
					value={email}
					onChange={(e) => setEmail(e.target.value)}
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
					checked={answer === SurveyAnswer.Yes}
					onChange={() => setAnswer(SurveyAnswer.Yes)}
					disabled={isDisabled || !!prefillAnswer}
				/>
				<Radio
					id="answer-no"
					name="answer"
					label="No"
					value={SurveyAnswer.No}
					checked={answer === SurveyAnswer.No}
					onChange={() => setAnswer(SurveyAnswer.No)}
					disabled={isDisabled || !!prefillAnswer}
				/>
				<Radio
					id="answer-cant"
					name="answer"
					label="Can't answer"
					value={SurveyAnswer.CantAnswer}
					checked={answer === SurveyAnswer.CantAnswer}
					onChange={() => setAnswer(SurveyAnswer.CantAnswer)}
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
			{success && <Alert type="success">{success}</Alert>}
		</form>
	);
}
