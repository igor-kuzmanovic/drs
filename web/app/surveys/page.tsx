"use client";

import { useEffect, useState } from "react";
import { useUser } from "../_context/UserContext";
import Link from "next/link";
import { printError } from "../_lib/error";
import Button from "../_components/Button";

type Survey = {
	id: string;
	name: string;
	question: string;
	endDate: string;
	isAnonymous: boolean;
	recipients: string[];
	status: string;
	createdAt: string;
	updatedAt: string;
};

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
			const token = localStorage.getItem("token");
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SURVEY_API_URL}/surveys`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Failed to fetch surveys");
			}
			const data = await res.json();
			setSurveys(data);
		} catch (err) {
			setError(printError(err));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user) fetchSurveys();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const handleTerminate = async (id: string) => {
		if (!confirm("Are you sure you want to terminate this survey?")) return;
		setTerminating(id);
		setSuccess(null);
		try {
			const token = localStorage.getItem("token");
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SURVEY_API_URL}/surveys/${id}/terminate`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Failed to terminate survey");
			}
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
			const token = localStorage.getItem("token");
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SURVEY_API_URL}/surveys/${id}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Failed to delete survey");
			}
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
			<h1 className="text-2xl font-bold mb-4">Your Surveys</h1>
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
				<table className="w-full border rounded bg-white">
					<thead>
						<tr className="bg-gray-100">
							<th className="p-2 text-left">Name</th>
							<th className="p-2 text-left">Question</th>
							<th className="p-2 text-left">Status</th>
							<th className="p-2 text-left">End Date</th>
							<th className="p-2 text-left">Actions</th>
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
								<td className="p-2 flex gap-2">
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
										{terminating === survey.id ? "Terminating..." : "Terminate"}
									</Button>
									<Button
										variant="secondary"
										size="sm"
										loading={deleting === survey.id}
										disabled={
											deleting === survey.id || terminating === survey.id
										}
										onClick={() => handleDelete(survey.id)}
									>
										{deleting === survey.id ? "Deleting..." : "Delete"}
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
