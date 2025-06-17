"use client";

import React from "react";
import Alert from "./Alert";
import { useHealth } from "../_context/HealthContext";
import { SERVICE_TYPES, ServiceType } from "../_lib/health";

interface ServiceUnavailableProps {
	serviceName: ServiceType;
	message?: string;
}

export default function ServiceUnavailable({
	serviceName,
	message = "This service is currently unavailable. Please try again later.",
}: ServiceUnavailableProps) {
	const { isUserServiceHealthy, isSurveyServiceHealthy } = useHealth();

	const isHealthy =
		(serviceName === SERVICE_TYPES.USER && isUserServiceHealthy) ||
		(serviceName === SERVICE_TYPES.SURVEY && isSurveyServiceHealthy);

	if (isHealthy) return null;

	return (
		<Alert type="error">
			<strong className="block">
				{serviceName === SERVICE_TYPES.USER ? "User" : "Survey"} Service
				Unavailable
			</strong>
			<p>{message}</p>
		</Alert>
	);
}
