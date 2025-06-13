"use client";

import React from "react";
import { SurveyResultResponse } from "../../_lib/api";
import { Inbox } from "lucide-react";

export default function SurveyResultsTable({
	isAnonymous,
	responses,
}: {
	isAnonymous: boolean;
	responses: SurveyResultResponse["responses"];
}) {
	if (isAnonymous) return null;
	return (
		<section>
			<div className="overflow-x-auto">
				<table className="w-full text-left border bg-white">
					<thead>
						<tr className="bg-gray-100">
							<th className="p-2">Respondent</th>
							<th className="p-2">Answer</th>
							<th className="p-2">Answered At</th>
						</tr>
					</thead>
					<tbody>
						{responses.length > 0 ? (
							responses.map((resp, idx) => (
								<tr key={idx} className="border-t">
									<td className="p-2">{resp.respondentEmail}</td>
									<td className="p-2">{resp.answer}</td>
									<td className="p-2">
										{new Date(resp.answeredAt).toLocaleString()}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={3}>
									<div className="flex flex-col items-center justify-center py-8 text-gray-400">
										<Inbox size={36} strokeWidth={1.5} />
										<div className="mt-2 text-base">No responses yet</div>
										<div className="text-sm">
											Responses will appear here once users respond.
										</div>
									</div>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</section>
	);
}
