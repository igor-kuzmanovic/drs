"use client";

import { useRouter } from "next/navigation";
import CreateSurveyForm from "./CreateSurveyForm";
import { useHealth } from "../../../_context/HealthContext";
import ServiceUnavailable from "../../../_components/ServiceUnavailable";
import { SERVICE_TYPES } from "../../../_lib/health";

export default function Page() {
	const router = useRouter();
	const { isSurveyServiceHealthy } = useHealth();

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

			<ServiceUnavailable
				serviceName={SERVICE_TYPES.SURVEY}
				message="Survey creation is currently unavailable. Please try again later."
			/>

			<CreateSurveyForm
				onSuccess={handleSuccess}
				onCancel={handleCancel}
				disabled={!isSurveyServiceHealthy}
			/>
		</div>
	);
}
