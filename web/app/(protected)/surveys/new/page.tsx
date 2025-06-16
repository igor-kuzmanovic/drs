"use client";

import { useRouter } from "next/navigation";
import CreateSurveyForm from "./CreateSurveyForm";

export default function Page() {
	const router = useRouter();

	const handleSuccess = () => {
		router.push("/");
	};

	const handleCancel = () => {
		router.push("/");
	};

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-center text-3xl font-bold">
				Create a new <span className="text-blue-600">Survey</span>
			</h1>
			<CreateSurveyForm onSuccess={handleSuccess} onCancel={handleCancel} />
		</div>
	);
}
