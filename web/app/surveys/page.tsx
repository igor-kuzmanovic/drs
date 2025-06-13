"use client";

import { useEffect, useState } from "react";
import { useUser } from "../_context/UserContext";
import Link from "next/link";
import { printError } from "../_lib/error";
import Button from "../_components/Button";
import { getSurveys, terminateSurvey, deleteSurvey, Survey } from "../_lib/api";

export default function SurveysPage() {
	const { user } = useUser();
	const [surveys, setSurveys] = useState<Survey[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [terminating, setTerminating] = useState<string | null>(null);
	const [deleting, setDeleting] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const fetchSurveys = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await getSurveys();
			setSurveys(data);
		} catch (err) {
			setError(printError(err));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user) fetchSurveys();
	}, [user]);

	const handleTerminate = async (id: string) => {
		if (!confirm("Are you sure you want to terminate this survey?")) return;
		setTerminating(id);
		setSuccess(null);
		try {
			await terminateSurvey(id);
			setSuccess("Survey terminated successfully.");
			await fetchSurveys();
		} catch (err) {
			alert(printError(err));
		} finally {
			setTerminating(null);
		}
	};

	const handleDelete = async (id: string) => {
		if (
			!confirm(
				"Are you sure you want to delete this survey? This cannot be undone.",
			)
		)
			return;
		setDeleting(id);
		setSuccess(null);
		try {
			await deleteSurvey(id);
			setSuccess("Survey deleted successfully.");
			await fetchSurveys();
		} catch (err) {
			alert(printError(err));
		} finally {
			setDeleting(null);
		}
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div className="text-red-600">{error}</div>;

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-center text-3xl font-bold">
				Your <span className="text-blue-600">Surveys</span>
			</h1>
			{success && (
				<div className="bg-green-100 text-green-700 px-4 py-2 rounded text-center">
					{success}
				</div>
			)}
			{surveys.length === 0 ? (
				<div>
					No surveys found.{" "}
					<Link href="/surveys/new" className="text-blue-600 underline">
						Create one?
					</Link>
				</div>
			) : (
				<div className="overflow-x-auto max-w-[calc(100vw-2rem)]">
					<table className="min-w-[600px] border rounded bg-white">
						<thead>
							<tr className="bg-gray-100">
								<th className="p-2 text-left">Name</th>
								<th className="p-2 text-left">Question</th>
								<th className="p-2 text-left">Status</th>
								<th className="p-2 text-left">End Date</th>
								<th className="p-2 text-left">Results</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{surveys.map((survey) => (
								<tr key={survey.id} className="border-t">
									<td className="p-2">{survey.name}</td>
									<td className="p-2">{survey.question}</td>
									<td className="p-2">{survey.status}</td>
									<td className="p-2">
										{new Date(survey.endDate).toLocaleString()}
									</td>
									<td className="p-2 text-sm">
										{survey.results ? (
											<div>
												<div>
													<b>
														{survey.isAnonymous ? "Responses" : "Respondents"}:
													</b>{" "}
													{Object.values(survey.results).reduce(
														(a, b) => a + b,
														0,
													)}
												</div>
												<div>
													<span className="text-green-700">
														Yes: {survey.results.YES}
													</span>
													{" | "}
													<span className="text-red-700">
														No: {survey.results.NO}
													</span>
													{" | "}
													<span className="text-gray-700">
														Can&apos;t answer: {survey.results.CANT_ANSWER}
													</span>
												</div>
											</div>
										) : (
											<span className="text-gray-400">No data</span>
										)}
									</td>
									<td className="p-2">
										<div className="flex gap-2">
											<Button
												href={`/surveys/${survey.id}`}
												variant="primary"
												size="sm"
											>
												View
											</Button>
											<Button
												variant="danger"
												size="sm"
												loading={terminating === survey.id}
												disabled={
													survey.status === "closed" ||
													terminating === survey.id ||
													deleting === survey.id
												}
												onClick={() => handleTerminate(survey.id)}
											>
												{terminating === survey.id
													? "Terminating..."
													: "Terminate"}
											</Button>
											<Button
												variant="secondary"
												size="sm"
												loading={deleting === survey.id}
												disabled={
													survey.status !== "closed" ||
													deleting === survey.id ||
													terminating === survey.id
												}
												onClick={() => handleDelete(survey.id)}
											>
												{deleting === survey.id ? "Deleting..." : "Delete"}
											</Button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
