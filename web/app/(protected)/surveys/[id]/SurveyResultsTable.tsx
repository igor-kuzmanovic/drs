"use client";

import React from "react";
import { SurveyAnswer, SurveyResultResponse } from "../../../_lib/api";

export default function SurveyResultsTable({
	responses,
}: {
	responses: SurveyResultResponse["responses"];
}) {
	return (
		<section>
			<div className="overflow-x-auto">
				<table className="w-full text-left border bg-white">
					<thead>
						<tr className="bg-gray-100">
							<th className="p-2">Respondent</th>
							<th className="p-2">Answer</th>
							<th className="p-2">Answered at</th>
						</tr>
					</thead>
					<tbody>
						{responses.map((resp, idx) => (
							<tr key={idx} className="border-t">
								<td className="p-2">{resp.respondentEmail ?? "Anonymous"}</td>
								<td className="p-2">
									{(() => {
										switch (resp.answer) {
											case SurveyAnswer.Yes:
												return "Yes";
											case SurveyAnswer.No:
												return "No";
											case SurveyAnswer.CantAnswer:
												return "Can't answer";
											default:
												return resp.answer;
										}
									})()}
								</td>
								<td className="p-2">
									{new Date(resp.answeredAt).toLocaleString()}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
}
