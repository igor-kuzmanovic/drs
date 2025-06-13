"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useUser } from "../_context/UserContext";
import { printError } from "../_lib/error";
import { getSurveys, Survey, terminateSurvey, deleteSurvey } from "../_lib/api";
import Alert from "../_components/Alert";
import SurveysTable from "./SurveysTable";
import { useSearchParams, useRouter } from "next/navigation";

const PAGE_SIZE = 20;

export default function Page() {
	const { user } = useUser();
	const searchParams = useSearchParams();
	const router = useRouter();

	const [surveys, setSurveys] = useState<Survey[]>([]);
	const [surveysLoading, setSurveysLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [terminating, setTerminating] = useState<string | null>(null);
	const [deleting, setDeleting] = useState<string | null>(null);
	const [total, setTotal] = useState(0);

	const name = searchParams.get("name") || "";
	const page = parseInt(searchParams.get("page") || "1", 10);

	const fetchSurveys = useCallback(async () => {
		setSurveysLoading(true);
		setError(null);
		try {
			const data = await getSurveys({ name, page, pageSize: PAGE_SIZE });
			setSurveys(data.items);
			setTotal(data.total);
		} catch (err) {
			setError(printError(err));
		} finally {
			setSurveysLoading(false);
		}
	}, [name, page]);

	useEffect(() => {
		if (user) fetchSurveys();
	}, [user, fetchSurveys]);

	const handleSearch = (searchValue: string) => {
		const params = new URLSearchParams(searchParams);
		if (searchValue) {
			params.set("name", searchValue);
		} else {
			params.delete("name");
		}
		params.set("page", "1");
		router.replace(`?${params.toString()}`);
	};

	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", String(newPage));
		router.replace(`?${params.toString()}`);
	};

	const handleTerminate = async (id: string) => {
		if (!confirm("Are you sure you want to terminate this survey?")) return;
		setTerminating(id);
		setSuccess(null);
		try {
			await terminateSurvey(id);
			await fetchSurveys();
			setSuccess("Survey terminated successfully.");
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
			await fetchSurveys();
			setSuccess("Survey deleted successfully.");
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
				<SurveysTable
					surveys={surveys}
					loading={surveysLoading}
					error={error}
					terminating={terminating}
					deleting={deleting}
					onTerminate={handleTerminate}
					onDelete={handleDelete}
					searchValue={name}
					onSearch={handleSearch}
					page={page}
					pageSize={PAGE_SIZE}
					total={total}
					onPageChange={handlePageChange}
				/>
				{!surveysLoading && !error && surveys.length === 0 && (
					<div>
						No surveys found.{" "}
						<Link href="/surveys/new" className="text-blue-600 underline">
							Create one?
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
