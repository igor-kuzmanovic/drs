"use client";

import React from "react";
import { Survey } from "../../../_lib/api";

export default function SurveyDetails({ survey }: { survey: Survey }) {
	return (
		<section className="bg-white border p-6 mb-8">
			<h2 className="text-2xl font-bold mb-4">{survey.name}</h2>
			<div className="mb-2">
				<span className="font-semibold">Question: </span>
				{survey.question}
			</div>
			<div className="mb-2">
				<span className="font-semibold">Status: </span>
				{survey.status}
			</div>
			<div className="mb-2">
				<span className="font-semibold">End date: </span>
				{new Date(survey.endDate).toLocaleString()}
			</div>
			<div className="mb-2">
				<span className="font-semibold">Anonymous: </span>
				{survey.isAnonymous ? "Yes" : "No"}
			</div>
			<div className="mb-2">
				<span className="font-semibold">Recipients: </span>
				{survey.recipients && survey.recipients.length > 0
					? survey.recipients.join(", ")
					: "None"}
			</div>
		</section>
	);
}
