"use client";

import React from "react";
import { Survey } from "../../../_lib/models";
import { StatusBadge } from "../../../_components/StatusBadge";

export default function SurveyDetails({ survey }: { survey: Survey }) {
	return (
		<section className="bg-white border p-6 mb-8">
			<div className="mb-4">
				<div className="text-lg font-semibold mb-1">Question</div>
				<div className="text-gray-800">{survey.question}</div>
			</div>
			<dl className="grid grid-cols-2 gap-x-4 gap-y-2">
				<div className="flex flex-row justify-between items-center">
					<dt className="font-semibold text-gray-600">Status</dt>
					<dd>
						<StatusBadge status={survey.status} />
					</dd>
				</div>
				<div className="flex flex-row justify-between items-center">
					<dt className="font-semibold text-gray-600">End date</dt>
					<dd className="text-xs text-gray-500 font-normal">
						{new Date(survey.endDate).toLocaleString()}
					</dd>
				</div>
				<div className="flex flex-row justify-between items-center">
					<dt className="font-semibold text-gray-600">Anonymous</dt>
					<dd>{survey.isAnonymous ? "Yes" : "No"}</dd>
				</div>
				<div className="flex flex-row justify-between items-center">
					<dt className="font-semibold text-gray-600">Recipients</dt>
					<dd className="truncate max-w-[70%] text-right">
						{Array.isArray(survey.recipients)
							? survey.recipients.length > 0
								? survey.recipients.join(", ")
								: "None"
							: survey.recipients
								? survey.recipients
								: "None"}
					</dd>
				</div>
			</dl>
		</section>
	);
}
