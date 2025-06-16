"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useUser } from "../_context/UserContext";
import SurveysTable from "./SurveysTable";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "../_context/ToastContext";
import { Survey } from "../_lib/models";
import SurveyService from "../_lib/survey";
import Loading from "../_components/Loading";

const PAGE_SIZE = 20;

export default function Page() {
	const { user } = useUser();
	const searchParams = useSearchParams();
	const router = useRouter();
	const { showToast } = useToast();

	const [surveys, setSurveys] = useState<Survey[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);

	// Get search parameters
	const name = useMemo(() => searchParams.get("name") || "", [searchParams]);
	const page = useMemo(
		() => parseInt(searchParams.get("page") || "1", 10),
		[searchParams],
	);

	// Define fetchSurveys first (to be used in other callbacks)
	const fetchSurveys = useCallback(async () => {
		if (!user) return;

		setLoading(true);
		try {
			const data = await SurveyService.getSurveys({
				name,
				page,
				pageSize: PAGE_SIZE,
			});

			setSurveys(data.items);
			setTotal(data.total);
		} catch (err) {
			showToast(err instanceof Error ? err.message : String(err), "error");
			setSurveys([]);
			setTotal(0);
		} finally {
			setLoading(false);
		}
	}, [user, name, page, showToast]);

	// Navigation helpers
	const handleSearch = useCallback(
		(searchValue: string) => {
			const params = new URLSearchParams(searchParams.toString());
			if (searchValue) {
				params.set("name", searchValue);
			} else {
				params.delete("name");
			}
			params.set("page", "1");
			router.replace(`?${params.toString()}`);
		},
		[router, searchParams],
	);

	const handlePageChange = useCallback(
		(newPage: number) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set("page", String(newPage));
			router.replace(`?${params.toString()}`);
		},
		[router, searchParams],
	);

	// Survey action handlers
	const handleTerminate = useCallback(
		async (id: string) => {
			if (!confirm("Are you sure you want to terminate this survey?")) return;

			try {
				await SurveyService.terminateSurvey(id);
				showToast("Survey terminated successfully", "success");
				fetchSurveys();
			} catch (err) {
				showToast(err instanceof Error ? err.message : String(err), "error");
			}
		},
		[showToast, fetchSurveys],
	);

	const handleDelete = useCallback(
		async (id: string) => {
			if (
				!confirm(
					"Are you sure you want to delete this survey? This cannot be undone.",
				)
			)
				return;

			try {
				await SurveyService.deleteSurvey(id);
				showToast("Survey deleted successfully", "success");
				fetchSurveys();
			} catch (err) {
				showToast(err instanceof Error ? err.message : String(err), "error");
			}
		},
		[showToast, fetchSurveys],
	);

	const handleRetryFailedEmails = useCallback(
		async (id: string) => {
			if (
				!confirm(
					"Are you sure you want to retry sending failed emails for this survey? This may take some time.",
				)
			)
				return;

			try {
				await SurveyService.retrySurveyFailedEmails(id);
				showToast("Retry started for failed emails", "success");
				fetchSurveys();
			} catch (err) {
				showToast(err instanceof Error ? err.message : String(err), "error");
			}
		},
		[showToast, fetchSurveys],
	);

	// Initial data load
	useEffect(() => {
		fetchSurveys();
	}, [fetchSurveys]);

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

					<SurveysTable
						surveys={surveys}
						loading={false}
						terminatingId={null}
						deletingId={null}
						retryingId={null}
						onTerminate={handleTerminate}
						onDelete={handleDelete}
						onRetryFailedEmails={handleRetryFailedEmails}
						searchValue={name}
						onSearch={handleSearch}
						page={page}
						pageSize={PAGE_SIZE}
						total={total}
						onPageChange={handlePageChange}
					/>

					{surveys.length === 0 && (
						<div>
							No surveys found.{" "}
							<Link href="/surveys/new" className="text-blue-600 underline">
								Create one?
							</Link>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
