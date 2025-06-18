"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useHealth } from "../_context/HealthContext";
import SurveysTable from "./SurveysTable";
import { useSearchParams } from "next/navigation";
import { TOAST_TYPES, useToast } from "../_context/ToastContext";
import { Survey } from "../_lib/models";
import SurveyService from "../_lib/survey";
import Loading from "../_components/Loading";
import ServiceUnavailable from "../_components/ServiceUnavailable";
import { SERVICE_TYPES } from "../_lib/health";
import { printError } from "../_lib/error";

const PAGE_SIZE = 20;

export default function Page() {
	const { isSurveyServiceHealthy } = useHealth();
	const searchParams = useSearchParams();
	const { showToast } = useToast();

	const [surveys, setSurveys] = useState<Survey[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [searchName, setSearchName] = useState("");
	const [currentPage, setCurrentPage] = useState(1);

	const fetchSurveys = useCallback(
		(name: string, page: number) => {
			setLoading(true);
			SurveyService.getSurveys({ name, page, pageSize: PAGE_SIZE })
				.then((data) => {
					setSurveys(data.items);
					setTotal(data.total);
				})
				.catch((err) => {
					showToast(printError(err), TOAST_TYPES.ERROR);
					setSurveys([]);
					setTotal(0);
				})
				.finally(() => setLoading(false));
		},
		[showToast],
	);

	const updateUrlAndFetch = useCallback(
		(name: string, page: number) => {
			const params = new URLSearchParams(searchParams.toString());

			if (name) {
				params.set("name", name);
			} else {
				params.delete("name");
			}

			params.set("page", String(page));
			window.history.replaceState(null, "", `?${params.toString()}`);

			setSearchName(name);
			setCurrentPage(page);
			fetchSurveys(name, page);
		},
		[fetchSurveys, searchParams],
	);

	const handleSearch = useCallback(
		(searchValue: string) => updateUrlAndFetch(searchValue, 1),
		[updateUrlAndFetch],
	);

	const handlePageChange = useCallback(
		(newPage: number) => updateUrlAndFetch(searchName, newPage),
		[searchName, updateUrlAndFetch],
	);

	const handleApiAction = useCallback(
		async (
			action: (id: string) => Promise<unknown>,
			id: string,
			confirmMessage: string,
			successMessage: string,
		) => {
			if (!confirm(confirmMessage)) return;

			try {
				await action(id);
				showToast(successMessage, TOAST_TYPES.SUCCESS);
				fetchSurveys(searchName, currentPage);
			} catch (err) {
				showToast(printError(err), TOAST_TYPES.ERROR);
			}
		},
		[fetchSurveys, showToast, searchName, currentPage],
	);

	const handleTerminate = useCallback(
		(id: string) =>
			handleApiAction(
				SurveyService.terminateSurvey,
				id,
				"Are you sure you want to terminate this survey?",
				"Survey terminated successfully",
			),
		[handleApiAction],
	);

	const handleDelete = useCallback(
		(id: string) =>
			handleApiAction(
				SurveyService.deleteSurvey,
				id,
				"Are you sure you want to delete this survey? This cannot be undone.",
				"Survey deleted successfully",
			),
		[handleApiAction],
	);

	const handleRetryFailedEmails = useCallback(
		(id: string) =>
			handleApiAction(
				SurveyService.retrySurveyFailedEmails,
				id,
				"Are you sure you want to retry sending failed emails for this survey? This may take some time.",
				"Retry started for failed emails",
			),
		[handleApiAction],
	);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const urlName = params.get("name") || "";
		const urlPage = parseInt(params.get("page") || "1", 10);

		if (window.location.search === "" || window.location.search === "?") {
			updateUrlAndFetch("", 1);
		} else {
			updateUrlAndFetch(urlName, urlPage);
		}
	}, [updateUrlAndFetch]);

	return (
		<div className="flex flex-col gap-8 min-h-[calc(100vh-64px)]">
			{loading ? (
				<div className="flex-1 flex items-center justify-center">
					<Loading />
				</div>
			) : (
				<div className="flex flex-col gap-6">
					<h1 className="text-center text-3xl font-bold">
						Your <span className="text-blue-600">Surveys</span>
					</h1>

					<ServiceUnavailable
						serviceName={SERVICE_TYPES.SURVEY}
						message="The survey service is currently unavailable. You can view your surveys, but you won't be able to create, edit, or manage them until the service is back online."
					/>

					<SurveysTable
						surveys={surveys}
						loading={false}
						disabled={!isSurveyServiceHealthy}
						onTerminate={handleTerminate}
						onDelete={handleDelete}
						onRetryFailedEmails={handleRetryFailedEmails}
						searchValue={searchName}
						onSearch={handleSearch}
						page={currentPage}
						pageSize={PAGE_SIZE}
						total={total}
						onPageChange={handlePageChange}
					/>

					{surveys.length === 0 && (
						<div>
							No surveys found.{" "}
							<Link
								href="/surveys/new"
								className={`text-blue-600 underline ${
									!isSurveyServiceHealthy ? "opacity-50 cursor-not-allowed" : ""
								}`}
								onClick={(e) => !isSurveyServiceHealthy && e.preventDefault()}
								title={
									!isSurveyServiceHealthy
										? "The survey service is currently unavailable"
										: undefined
								}
							>
								Create one?
							</Link>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
