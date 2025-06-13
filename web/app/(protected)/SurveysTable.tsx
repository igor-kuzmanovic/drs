import Button from "../_components/Button";
import { Survey } from "../_lib/api";

type SurveysTableProps = {
	surveys: Survey[];
	terminating: string | null;
	deleting: string | null;
	onTerminate: (id: string) => void;
	onDelete: (id: string) => void;
};

export default function SurveysTable({
	surveys,
	terminating,
	deleting,
	onTerminate,
	onDelete,
}: SurveysTableProps) {
	return (
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
											<b>{survey.isAnonymous ? "Responses" : "Respondents"}:</b>{" "}
											{Object.values(survey.results).reduce((a, b) => a + b, 0)}
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
										onClick={() => onTerminate(survey.id)}
									>
										{terminating === survey.id ? "Terminating..." : "Terminate"}
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
										onClick={() => onDelete(survey.id)}
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
	);
}
