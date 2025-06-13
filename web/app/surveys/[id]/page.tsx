"use client";

import { useEffect, useState } from "react";
import React from "react";
import {
	getSurvey,
	getSurveyResults,
	Survey,
	SurveyResultResponse,
} from "../../_lib/api";
import { useParams } from "next/navigation";
import SurveyDetails from "./SurveyDetails";
import SurveyStatistics from "./SurveyStatistics";
import SurveyResultsTable from "./SurveyResultsTable";

export default function SurveyDetailPage() {
	const params = useParams<{ id: string }>();
	const id = params.id;

	const [survey, setSurvey] = useState<Survey | null>(null);
	const [results, setResults] = useState<SurveyResultResponse | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getSurvey(id).then((data) => setSurvey(data));
		getSurveyResults(id).then((data) => setResults(data));
		setLoading(false);
	}, [id]);

	let chartData: { name: string; count: number }[] = [];
	let hasResponses = false;

	if (results) {
		const yes = results.results?.YES ?? 0;
		const no = results.results?.NO ?? 0;
		const cantAnswer = results.results?.CANT_ANSWER ?? 0;
		hasResponses = yes > 0 || no > 0 || cantAnswer > 0;

		if (hasResponses) {
			chartData = [
				{ name: "Yes", count: yes },
				{ name: "No", count: no },
				{ name: "Can't answer", count: cantAnswer },
			];
		}
	}

	if (loading || !survey || !results) {
		return (
			<div className="max-w-2xl mx-auto py-8 text-center text-gray-500">
				Loading survey...
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto py-8">
			<h1 className="text-3xl font-bold mb-8 text-center">
				<span className="text-blue-600">Survey</span> Details
			</h1>
			<SurveyDetails survey={survey} />
			<SurveyStatistics hasResponses={hasResponses} chartData={chartData} />
			<SurveyResultsTable
				isAnonymous={survey.isAnonymous}
				responses={results.responses}
			/>
		</div>
	);
}
