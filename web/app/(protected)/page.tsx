"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "../_context/UserContext";
import Alert from "../_components/Alert";
import SurveysTable from "./SurveysTable";
import { useSearchParams, useRouter } from "next/navigation";
import { useApiCall } from "../_hooks/useApiCall";
import { useToast } from "../_context/ToastContext";
import { Survey } from "../_lib/models";
import SurveyService from "../_lib/survey";

const PAGE_SIZE = 20;

export default function Page() {
	const { user } = useUser();
	const searchParams = useSearchParams();
	const router = useRouter();
	const { showToast } = useToast();

	const [surveys, setSurveys] = useState<Survey[]>([]);
	const [total, setTotal] = useState(0);
	const [success, setSuccess] = useState<string | null>(null);

	const name = searchParams.get("name") || "";
	const page = parseInt(searchParams.get("page") || "1", 10);

	const getSurveysApi = useApiCall<
		[{ name: string; page: number; pageSize: number }],
		{ items: Survey[]; total: number; page: number; pageSize: number }
	>(async (params) => {
		return SurveyService.getSurveys(params);
	});

	const terminateSurveyApi = useApiCall<[string], void>(
		async (id) => {
			return SurveyService.terminateSurvey(id);
		},
		{
			onSuccess: () => {
				showToast("Survey terminated successfully", "success");
				setSuccess("Survey terminated successfully");
				// Refresh surveys by updating page which will trigger the effect
				const currentParams = new URLSearchParams(searchParams.toString());
				router.replace(`?${currentParams.toString()}`);
			},
		},
	);

	const deleteSurveyApi = useApiCall<[string], void>(
		async (id) => {
			return SurveyService.deleteSurvey(id);
		},
		{
			onSuccess: () => {
				showToast("Survey deleted successfully", "success");
				setSuccess("Survey deleted successfully");
				// Refresh surveys by updating page which will trigger the effect
				const currentParams = new URLSearchParams(searchParams.toString());
				router.replace(`?${currentParams.toString()}`);
			},
		},
	);

	const retrySurveyFailedEmailsApi = useApiCall<[string], void>(
		async (id) => {
			return SurveyService.retrySurveyFailedEmails(id);
		},
		{
			onSuccess: () => {
				showToast("Retry started for failed emails", "success");
				setSuccess("Retry started for failed emails");
				// Refresh surveys by updating page which will trigger the effect
				const currentParams = new URLSearchParams(searchParams.toString());
				router.replace(`?${currentParams.toString()}`);
			},
		},
	);

	useEffect(() => {
		if (user) {
			const loadSurveysInEffect = async () => {
				const data = await getSurveysApi.execute({
					name,
					page,
					pageSize: PAGE_SIZE,
				});
				if (data) {
					setSurveys(data.items);
					setTotal(data.total);
				}
			};

			loadSurveysInEffect();
		}
	}, [user, name, page, getSurveysApi]);

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
		await terminateSurveyApi.execute(id);
	};

	const handleDelete = async (id: string) => {
		if (
			!confirm(
				"Are you sure you want to delete this survey? This cannot be undone.",
			)
		)
			return;
		await deleteSurveyApi.execute(id);
	};

	const handleRetryFailedEmails = async (id: string) => {
		if (
			!confirm(
				"Are you sure you want to retry sending failed emails for this survey? This may take some time.",
			)
		)
			return;
		await retrySurveyFailedEmailsApi.execute(id);
	};

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-6">
				<h1 className="text-center text-3xl font-bold">
					Your <span className="text-blue-600">Surveys</span>
				</h1>
				{success && <Alert type="success">{success}</Alert>}
				{(getSurveysApi.error ||
					terminateSurveyApi.error ||
					deleteSurveyApi.error ||
					retrySurveyFailedEmailsApi.error) && (
					<Alert type="error">
						{getSurveysApi.error ||
							terminateSurveyApi.error ||
							deleteSurveyApi.error ||
							retrySurveyFailedEmailsApi.error}
					</Alert>
				)}
				<SurveysTable
					surveys={surveys}
					loading={getSurveysApi.loading}
					terminatingId={
						terminateSurveyApi.loading
							? Object.keys(terminateSurveyApi)[0]
							: null
					}
					deletingId={
						deleteSurveyApi.loading ? Object.keys(deleteSurveyApi)[0] : null
					}
					retryingId={
						retrySurveyFailedEmailsApi.loading
							? Object.keys(retrySurveyFailedEmailsApi)[0]
							: null
					}
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
				{!getSurveysApi.loading &&
					!getSurveysApi.error &&
					surveys.length === 0 && (
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
