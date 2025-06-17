"use client";

import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	useMemo,
} from "react";
import HealthService, {
	ServicesHealth,
	SERVICE_TYPES,
	ServiceType,
} from "../_lib/health";

interface HealthContextType {
	servicesHealth: ServicesHealth;
	isUserServiceHealthy: boolean;
	isSurveyServiceHealthy: boolean;
	checkServiceHealth: (service: ServiceType) => Promise<void>;
	checkAllServicesHealth: () => Promise<void>;
}

const HealthContext = createContext<HealthContextType | null>(null);

export const useHealth = (): HealthContextType => {
	const context = useContext(HealthContext);
	if (!context) {
		throw new Error("useHealth must be used within a HealthProvider");
	}
	return context;
};

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [servicesHealth, setServicesHealth] = useState<ServicesHealth>(
		HealthService.getServicesHealth(),
	);

	useEffect(() => {
		const unsubscribe = HealthService.setHealthChangeHandler(setServicesHealth);

		// Check all services once on page load
		HealthService.checkAllServicesHealth();

		return unsubscribe;
	}, []);

	const checkServiceHealth = async (service: ServiceType) => {
		if (service === SERVICE_TYPES.USER) {
			await HealthService.checkUserServiceHealth();
		} else {
			await HealthService.checkSurveyServiceHealth();
		}
	};

	const value = useMemo(
		() => ({
			servicesHealth,
			isUserServiceHealthy: servicesHealth[SERVICE_TYPES.USER].isHealthy,
			isSurveyServiceHealthy: servicesHealth[SERVICE_TYPES.SURVEY].isHealthy,
			checkServiceHealth,
			checkAllServicesHealth: async () => {
				await HealthService.checkAllServicesHealth();
			},
		}),
		[servicesHealth],
	);

	return (
		<HealthContext.Provider value={value}>{children}</HealthContext.Provider>
	);
};

export default HealthContext;
