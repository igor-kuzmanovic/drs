import { useState } from "react";
import { X } from "lucide-react";
import Action from "../_components/Action";
import Loading from "../_components/Loading";
import Input from "../_components/Input";
import { Survey, SurveyStatus } from "../_lib/api";
import { StatusBadge } from "../_components/StatusBadge";

type SurveysTableProps = {
	surveys: Survey[];
	loading?: boolean;
	terminatingId?: string | null;
	deletingId?: string | null;
	retryingId?: string | null;
	onTerminate: (id: string) => void;
	onDelete: (id: string) => void;
	onRetryFailedEmails: (surveyId: string) => void;
	searchValue: string;
	onSearch: (value: string) => void;
	page: number;
	pageSize: number;
	total: number;
	onPageChange: (page: number) => void;
};

export default function SurveysTable({
	surveys,
	loading,
	terminatingId,
	deletingId,
	retryingId,
	onTerminate,
	onDelete,
	onRetryFailedEmails,
	searchValue,
	onSearch,
	page,
	pageSize,
	total,
	onPageChange,
}: SurveysTableProps) {
	const [searchInput, setSearchInput] = useState(searchValue);

	const totalPages = Math.max(1, Math.ceil(total / pageSize));

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch(searchInput.trim());
	};

	const handleClear = () => {
		setSearchInput("");
		onSearch("");
	};

	return (
		<div>
			<form
				onSubmit={handleSubmit}
				className="flex w-full mx-auto items-center gap-2 mb-4"
			>
				<div className="relative flex-1">
					<Input
						id="survey-search"
						label="Search surveys by title"
						labelClassName="sr-only"
						placeholder="Search surveys by title..."
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						className="pr-10"
					/>
					{searchInput && (
						<button
							type="button"
							onClick={handleClear}
							className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
							aria-label="Clear search"
							tabIndex={0}
						>
							<X className="w-4 h-4" />
						</button>
					)}
				</div>
				<Action
					type="submit"
					variant="secondary"
					size="sm"
					className="h-[42px] px-4"
				>
					Search
				</Action>
			</form>
			{loading ? (
				<Loading />
			) : (
				<div className="overflow-x-auto max-w-[calc(100vw-2rem)]">
					<table className="w-full min-w-[600px] border bg-white">
						<thead>
							<tr className="bg-gray-100">
								<th className="p-2 text-left">Name</th>
								<th className="p-2 text-left">Status</th>
								<th className="p-2 text-left">End</th>
								<th className="p-2 text-center">Stats</th>
								<th className="p-2 text-center">Actions</th>
							</tr>
						</thead>
						<tbody>
							{surveys.map((survey) => (
								<tr key={survey.id} className="border-t align-middle">
									<td className="p-2 font-medium">{survey.name}</td>
									<td className="p-2">
										<StatusBadge status={survey.status} />
									</td>
									<td className="p-2 text-xs text-gray-500">
										{new Date(survey.endDate).toLocaleDateString()}
									</td>
									<td className="p-2 text-center">
										<div className="flex flex-col gap-1 items-center">
											<div className="flex gap-1">
												<span
													title="Yes"
													className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold"
												>
													Y: {survey.results?.YES ?? 0}
												</span>
												<span
													title="No"
													className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-semibold"
												>
													N: {survey.results?.NO ?? 0}
												</span>
												<span
													title="Can't answer"
													className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-semibold"
												>
													C: {survey.results?.CANT_ANSWER ?? 0}
												</span>
											</div>
											<div className="flex gap-1 text-xs">
												<span
													title="Sent"
													className="bg-green-50 text-green-700 px-1 rounded"
												>
													S: {survey.emailStatusSummary?.sent ?? 0}
												</span>
												<span
													title="Pending"
													className="bg-yellow-50 text-yellow-700 px-1 rounded"
												>
													P: {survey.emailStatusSummary?.pending ?? 0}
												</span>
												<span
													title="Failed"
													className="bg-red-50 text-red-700 px-1 rounded"
												>
													F: {survey.emailStatusSummary?.failed ?? 0}
												</span>
											</div>
										</div>
									</td>
									<td className="p-2 text-center">
										<div className="flex flex-wrap items-center gap-2">
											<Action
												href={`/surveys/${survey.id}`}
												variant="primary"
												size="sm"
											>
												View
											</Action>
											{survey.status !== SurveyStatus.Closed ? (
												<>
													<Action
														variant="secondary"
														size="sm"
														loading={terminatingId === survey.id}
														disabled={
															terminatingId === survey.id ||
															deletingId === survey.id
														}
														onClick={() => onTerminate(survey.id)}
													>
														{terminatingId === survey.id
															? "Terminating..."
															: "Terminate"}
													</Action>
													{survey.emailStatusSummary &&
														survey.emailStatusSummary.failed > 0 && (
															<Action
																variant="danger"
																size="sm"
																loading={retryingId === survey.id}
																disabled={
																	retryingId !== null &&
																	retryingId !== survey.id
																}
																onClick={() => onRetryFailedEmails(survey.id)}
															>
																{retryingId === survey.id
																	? "Retrying Failed Emails..."
																	: "Retry Failed Emails"}
															</Action>
														)}
												</>
											) : (
												<Action
													variant="danger"
													size="sm"
													loading={deletingId === survey.id}
													disabled={
														deletingId !== null ||
														survey.status !== SurveyStatus.Closed ||
														deletingId === survey.id ||
														terminatingId === survey.id
													}
													onClick={() => onDelete(survey.id)}
												>
													{deletingId === survey.id ? "Deleting..." : "Delete"}
												</Action>
											)}
										</div>
									</td>
								</tr>
							))}
							{surveys.length === 0 && (
								<tr>
									<td colSpan={6} className="p-4 text-center text-gray-400">
										No surveys found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			)}
			{totalPages > 1 && (
				<div className="flex justify-center items-center gap-4 mt-4">
					<Action
						variant="secondary"
						size="sm"
						onClick={() => onPageChange(page - 1)}
						disabled={page === 1}
					>
						Prev
					</Action>
					<span className="text-sm">
						Page {page} of {totalPages}
					</span>
					<Action
						variant="secondary"
						size="sm"
						onClick={() => onPageChange(page + 1)}
						disabled={page === totalPages}
					>
						Next
					</Action>
				</div>
			)}
		</div>
	);
}
