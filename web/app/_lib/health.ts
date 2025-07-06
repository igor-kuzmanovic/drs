import { userApiClient, surveyApiClient } from "./apiClient";

export const SERVICE_TYPES = {
	USER: "userService",
	SURVEY: "surveyService",
} as const;

export type ServiceType = (typeof SERVICE_TYPES)[keyof typeof SERVICE_TYPES];

export const HEALTH_ENDPOINTS = {
	USER: process.env.NEXT_PUBLIC_SURVEY_API_HEALTH_ENDPOINT!,
	SURVEY: process.env.NEXT_PUBLIC_SURVEY_API_HEALTH_ENDPOINT!,
} as const;

export interface ServiceHealth {
	isHealthy: boolean;
	lastChecked: Date;
	message?: string;
}

export interface ServicesHealth {
	[SERVICE_TYPES.USER]: ServiceHealth;
	[SERVICE_TYPES.SURVEY]: ServiceHealth;
}

const SERVICE_UNAVAILABLE_STATUSES = [502, 503, 504];

class HealthServiceClass {
	private healthState: ServicesHealth = {
		[SERVICE_TYPES.USER]: {
			isHealthy: true,
			lastChecked: new Date(),
		},
		[SERVICE_TYPES.SURVEY]: {
			isHealthy: true,
			lastChecked: new Date(),
		},
	};

	private healthChangeHandler: ((health: ServicesHealth) => void) | null = null;
	private recoveryChecksIntervalId: NodeJS.Timeout | null = null;
	private recoveryCheckInterval = 10_000;

	constructor() {}

	private startRecoveryChecks() {
		if (this.recoveryChecksIntervalId === null) {
			this.recoveryChecksIntervalId = setInterval(() => {
				const unhealthyServices = Object.entries(this.healthState)
					.filter(([, health]) => !health.isHealthy)
					.map(([service]) => service as ServiceType);

				if (unhealthyServices.length === 0) {
					this.stopRecoveryChecks();
					return;
				}

				unhealthyServices.forEach((service) => {
					if (service === SERVICE_TYPES.USER) {
						this.checkUserServiceHealth();
					} else if (service === SERVICE_TYPES.SURVEY) {
						this.checkSurveyServiceHealth();
					}
				});
			}, this.recoveryCheckInterval);
		}
	}

	private stopRecoveryChecks() {
		if (this.recoveryChecksIntervalId !== null) {
			clearInterval(this.recoveryChecksIntervalId);
			this.recoveryChecksIntervalId = null;
		}
	}

	private async checkServiceHealth(
		apiClient: typeof userApiClient | typeof surveyApiClient,
		serviceType: ServiceType,
	): Promise<ServiceHealth> {
		try {
			const endpoint =
				serviceType === SERVICE_TYPES.USER
					? HEALTH_ENDPOINTS.USER
					: HEALTH_ENDPOINTS.SURVEY;
			await apiClient.get<{ status: string }>(endpoint, {}, { noAuth: true });

			this.healthState[serviceType] = {
				isHealthy: true,
				lastChecked: new Date(),
			};
		} catch {
			this.healthState[serviceType] = {
				isHealthy: false,
				lastChecked: new Date(),
				message: `${serviceType === SERVICE_TYPES.USER ? "User" : "Survey"} service is currently unavailable.`,
			};

			this.startRecoveryChecks();
		}

		this.notifyHealthChange();
		return this.healthState[serviceType];
	}

	private notifyHealthChange() {
		if (this.healthChangeHandler) {
			this.healthChangeHandler({ ...this.healthState });
		}
	}

	getServicesHealth(): ServicesHealth {
		return { ...this.healthState };
	}

	setHealthChangeHandler(
		handler: (health: ServicesHealth) => void,
	): () => void {
		this.healthChangeHandler = handler;
		return () => {
			this.healthChangeHandler = null;
		};
	}

	markServiceUnhealthy(serviceType: ServiceType, errorStatus?: number): void {
		if (errorStatus && !SERVICE_UNAVAILABLE_STATUSES.includes(errorStatus)) {
			return;
		}

		this.healthState[serviceType] = {
			isHealthy: false,
			lastChecked: new Date(),
			message: `${serviceType === SERVICE_TYPES.USER ? "User" : "Survey"} service is currently unavailable.`,
		};
		this.notifyHealthChange();
		this.startRecoveryChecks();
	}

	async checkUserServiceHealth(): Promise<ServiceHealth> {
		return this.checkServiceHealth(userApiClient, SERVICE_TYPES.USER);
	}

	async checkSurveyServiceHealth(): Promise<ServiceHealth> {
		return this.checkServiceHealth(surveyApiClient, SERVICE_TYPES.SURVEY);
	}

	async checkAllServicesHealth(): Promise<ServicesHealth> {
		await Promise.all([
			this.checkUserServiceHealth(),
			this.checkSurveyServiceHealth(),
		]);
		return this.getServicesHealth();
	}
}

const HealthService = new HealthServiceClass();
export default HealthService;
