"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PublicSurvey, SURVEY_STATUS } from "../../_lib/models";
import SurveyService from "../../_lib/survey";
import Loading from "../../_components/Loading";
import { SurveyRespondForm } from "./SurveyRespondForm";
import { useUser } from "../../_context/UserContext";
import { useHealth } from "../../_context/HealthContext";
import ServiceUnavailable from "../../_components/ServiceUnavailable";
import { SERVICE_TYPES } from "../../_lib/health";

export default function RespondSurveyPage() {
	const params = useParams<{ id: string }>();
	const searchParams = useSearchParams();
	const id = params.id;

	const [survey, setSurvey] = useState<PublicSurvey | null>(null);
	const [loading, setLoading] = useState(true);

	const { isSurveyServiceHealthy } = useHealth();
	const { user } = useUser();

	// Prefill from query params
	const prefillEmail = user?.email || "";
	const prefillAnswer = searchParams.get("answer") || "";
	const token = searchParams.get("token") || "";

	useEffect(() => {
		SurveyService.getPublicSurvey(id)
			.then(setSurvey)
			.finally(() => setLoading(false));
	}, [id]);

	if (loading)
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loading />
			</div>
		);
	if (!survey)
		return <div className="text-center text-lg mt-12">Survey not found.</div>;
	if (survey.status === SURVEY_STATUS.CLOSED) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh]">
				<h1 className="text-3xl font-bold mb-4 text-center">{survey.name}</h1>
				<div className="text-red-700 text-lg font-semibold bg-red-100 px-6 py-4">
					This survey is closed. You can no longer submit a response.
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-8 items-center justify-center min-h-[60vh]">
			<div className="w-full max-w-md">
				<h1 className="text-3xl font-bold mb-2 text-center">{survey.name}</h1>
				<p className="text-lg text-gray-700 mb-6 text-center">
					{survey.question}
				</p>

				<ServiceUnavailable
					serviceName={SERVICE_TYPES.SURVEY}
					message="Survey response submission is currently unavailable. Please try again later."
				/>

				<SurveyRespondForm
					surveyId={id}
					isAnonymous={survey.isAnonymous}
					prefillEmail={prefillEmail}
					prefillAnswer={prefillAnswer}
					token={token}
					disabled={!isSurveyServiceHealthy}
				/>
			</div>
		</div>
	);
}
