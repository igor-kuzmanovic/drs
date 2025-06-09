"use client";

import CreateSurveyForm from "./CreateSurveyForm";

export default function Page() {
	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-center text-3xl font-bold">
				Create new <span className="text-blue-600">Survey</span>
			</h1>
			<CreateSurveyForm />
		</div>
	);
}
