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
	error?: string | null;
	terminating: string | null;
	deleting: string | null;
	onTerminate: (id: string) => void;
	onDelete: (id: string) => void;
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
	error,
	terminating,
	deleting,
	onTerminate,
	onDelete,
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
			) : error ? (
				<div className="text-red-600">{error}</div>
			) : (
				<div className="overflow-x-auto max-w-[calc(100vw-2rem)]">
					<table className="w-full min-w-[600px] border bg-white">
						<thead>
							<tr className="bg-gray-100">
								<th className="p-2 text-left text-nowrap">Name</th>
								<th className="p-2 text-left text-nowrap">Question</th>
								<th className="p-2 text-left text-nowrap">Status</th>
								<th className="p-2 text-left text-nowrap">End date</th>
								<th className="p-2 text-left text-nowrap">Results</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{surveys.map((survey) => (
								<tr key={survey.id} className="border-t">
									<td className="p-2">{survey.name}</td>
									<td className="p-2">{survey.question}</td>
									<td className="p-2">
										<StatusBadge status={survey.status} />
									</td>
									<td className="p-2">
										<span className="text-xs text-gray-500 font-normal">
											{new Date(survey.endDate).toLocaleString()}
										</span>
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
											<Action
												href={`/surveys/${survey.id}`}
												variant="primary"
												size="sm"
											>
												View
											</Action>
											{survey.status !== SurveyStatus.Closed ? (
												<Action
													variant="secondary"
													size="sm"
													loading={terminating === survey.id}
													disabled={
														terminating === survey.id || deleting === survey.id
													}
													onClick={() => onTerminate(survey.id)}
												>
													{terminating === survey.id
														? "Terminating..."
														: "Terminate"}
												</Action>
											) : (
												<Action
													variant="danger"
													size="sm"
													loading={deleting === survey.id}
													disabled={
														survey.status !== SurveyStatus.Closed ||
														deleting === survey.id ||
														terminating === survey.id
													}
													onClick={() => onDelete(survey.id)}
												>
													{deleting === survey.id ? "Deleting..." : "Delete"}
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
