"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Survey, SurveyResultResponse } from "../../../_lib/models";
import SurveyService from "../../../_lib/survey";
import SurveyDetails from "./SurveyDetails";
import SurveyResultsTable from "./SurveyResultsTable";
import Loading from "../../../_components/Loading";
import Action from "../../../_components/Action";
import Input from "../../../_components/Input";
import { Clipboard } from "lucide-react";
import { Inbox } from "lucide-react";
import { SurveyPieChart } from "./SurveyPieChart";
import { SurveyDailyChart } from "./SurveyDailyChart";
import { useHealth } from "../../../_context/HealthContext";
import ServiceUnavailable from "../../../_components/ServiceUnavailable";
import { SERVICE_TYPES } from "../../../_lib/health";

export default function SurveyDetailPage() {
	const params = useParams<{ id: string }>();
	const id = params.id;
	const { isSurveyServiceHealthy } = useHealth();

	const [survey, setSurvey] = useState<Survey | null>(null);
	const [results, setResults] = useState<SurveyResultResponse | null>(null);
	const [dataLoading, setDataLoading] = useState(true);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		SurveyService.getSurvey(id).then((data) => setSurvey(data));
		SurveyService.getSurveyResults(id).then((data) => setResults(data));
		setDataLoading(false);
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

	let dailyCounts: { date: string; count: number }[] = [];
	if (results && results.responses) {
		const counts: Record<string, number> = {};
		results.responses.forEach((resp) => {
			const date = new Date(resp.answeredAt).toISOString().slice(0, 10);
			counts[date] = (counts[date] || 0) + 1;
		});
		dailyCounts = Object.entries(counts)
			.map(([date, count]) => ({ date, count }))
			.sort((a, b) => a.date.localeCompare(b.date));
	}

	if (dataLoading || !survey || !results) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loading />
			</div>
		);
	}

	const noResponses = !hasResponses;

	const shareUrl = `/respond/${id}`;

	const handleCopy = async () => {
		if (shareUrl) {
			const fullUrl = `${window.location.origin}${shareUrl}`;
			await navigator.clipboard.writeText(fullUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		}
	};

	return (
		<div className="max-w-2xl mx-auto">
			<h1 className="text-3xl font-bold mb-6 text-center">
				<span className="text-blue-600">{survey.name}</span> Details
			</h1>

			<ServiceUnavailable
				serviceName={SERVICE_TYPES.SURVEY}
				message="The survey service is currently unavailable. You can view survey details, but some features may not work properly until the service is back online."
			/>

			<div className="mb-6">
				<SurveyDetails survey={survey} />
				<div className="flex items-center gap-2 mt-2">
					<Input
						id="share-link"
						type="text"
						value={shareUrl}
						readOnly
						className="w-full"
						onFocus={(e) => e.target.select()}
						label={null}
						inputSize="md"
						wrapperClassName="flex-1"
						disabled={!isSurveyServiceHealthy}
					/>
					<Action
						type="button"
						variant="secondary"
						size="md"
						onClick={handleCopy}
						disabled={!shareUrl || !isSurveyServiceHealthy}
						requiredService={SERVICE_TYPES.SURVEY}
					>
						<Clipboard size={16} />
						{copied ? "Copied!" : "Copy link"}
					</Action>
				</div>
				<div className="text-xs text-gray-500 mt-1">
					Share this link to let others respond to your survey.
				</div>
			</div>
			{noResponses ? (
				<div className="flex flex-col items-center justify-center py-12 text-gray-400">
					<Inbox size={48} strokeWidth={1.5} />
					<div className="mt-4 text-lg">No responses yet</div>
					<div className="text-sm">
						Results will appear here once users respond.
					</div>
				</div>
			) : (
				<>
					<SurveyPieChart chartData={chartData} />
					<SurveyDailyChart dailyCounts={dailyCounts} />
					<SurveyResultsTable responses={results.responses} />
				</>
			)}
		</div>
	);
}
