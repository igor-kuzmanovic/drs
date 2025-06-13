"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "../_context/UserContext";
import { printError } from "../_lib/error";
import { getSurveys, terminateSurvey, deleteSurvey, Survey } from "../_lib/api";
import Loading from "../_components/Loading";
import Alert from "../_components/Alert";
import SurveysTable from "./SurveysTable";

export default function Page() {
	const { user } = useUser();

	const [surveys, setSurveys] = useState<Survey[]>([]);
	const [surveysLoading, setSurveysLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [terminating, setTerminating] = useState<string | null>(null);
	const [deleting, setDeleting] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const fetchSurveys = async () => {
		setSurveysLoading(true);
		setError(null);
		try {
			const data = await getSurveys();
			setSurveys(data);
		} catch (err) {
			setError(printError(err));
		} finally {
			setSurveysLoading(false);
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

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-6">
				<h1 className="text-center text-3xl font-bold">
					Your <span className="text-blue-600">Surveys</span>
				</h1>
				{success && <Alert type="success">{success}</Alert>}
				{surveysLoading ? (
					<Loading />
				) : error ? (
					<div className="text-red-600">{error}</div>
				) : surveys.length === 0 ? (
					<div>
						No surveys found.{" "}
						<Link href="/surveys/new" className="text-blue-600 underline">
							Create one?
						</Link>
					</div>
				) : (
					<SurveysTable
						surveys={surveys}
						terminating={terminating}
						deleting={deleting}
						onTerminate={handleTerminate}
						onDelete={handleDelete}
					/>
				)}
			</div>
		</div>
	);
}
