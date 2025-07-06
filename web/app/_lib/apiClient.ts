import AuthService from "./auth";
import HealthService, { ServiceType, SERVICE_TYPES } from "./health";

interface ApiClientOptions {
	baseUrl: string;
	serviceType: ServiceType;
}

export class ApiClient {
	private baseUrl: string;
	private serviceType: ServiceType;

	constructor(options: ApiClientOptions) {
		this.baseUrl = options.baseUrl;
		this.serviceType = options.serviceType;
	}

	async request<T>(
		endpoint: string,
		options: RequestInit & { noAuth?: boolean } = {},
	): Promise<T> {
		const token = AuthService.getToken();

		const headers: HeadersInit = {
			Accept: "application/json",
			"Content-Type": "application/json",
			...(options.noAuth
				? {}
				: token
					? { Authorization: `Bearer ${token}` }
					: {}),
			...(options.headers || {}),
		};

		const { noAuth, ...fetchOptions } = options;

		try {
			const response = await fetch(endpoint.startsWith("http://") || endpoint.startsWith("https://")
	? endpoint
	: `${this.baseUrl}${endpoint}`, {
				...fetchOptions,
				headers,
			});

			if (!noAuth && response.status === 401) {
				AuthService.removeToken();
				window.location.href = "/login";
				throw {
					status: 401,
					data: { error: "Authentication failed. Please log in again." },
				};
			}

			if (response.status >= 500) {
				HealthService.markServiceUnhealthy(this.serviceType, response.status);
			}

			const data = await response.json();

			if (!response.ok) {
				throw {
					status: response.status,
					data:
						typeof data === "object"
							? data
							: { error: data || response.statusText },
				};
			}

			return data as T;
		} catch (error) {
			if (error instanceof TypeError && error.message.includes("fetch")) {
				HealthService.markServiceUnhealthy(this.serviceType);
			}

			throw error;
		}
	}

	async get<T>(
		endpoint: string,
		queryParams: Record<string, string | number | boolean> = {},
		options: { noAuth?: boolean } = {},
	): Promise<T> {
		const params = new URLSearchParams();

		Object.entries(queryParams).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				params.append(key, String(value));
			}
		});

		const queryString = params.toString();
		const url = queryString ? `${endpoint}?${queryString}` : endpoint;

		return this.request<T>(url, { method: "GET", ...options });
	}

	async post<T>(
		endpoint: string,
		data?: unknown,
		options: { noAuth?: boolean } = {},
	): Promise<T> {
		return this.request<T>(endpoint, {
			method: "POST",
			body: data ? JSON.stringify(data) : undefined,
			...options,
		});
	}

	async put<T>(
		endpoint: string,
		data?: unknown,
		options: { noAuth?: boolean } = {},
	): Promise<T> {
		return this.request<T>(endpoint, {
			method: "PUT",
			body: data ? JSON.stringify(data) : undefined,
			...options,
		});
	}

	async delete<T>(
		endpoint: string,
		options: { noAuth?: boolean } = {},
	): Promise<T> {
		return this.request<T>(endpoint, { method: "DELETE", ...options });
	}
}

export const userApiClient = new ApiClient({
	baseUrl: process.env.NEXT_PUBLIC_USER_API_URL!,
	serviceType: SERVICE_TYPES.USER,
});

export const surveyApiClient = new ApiClient({
	baseUrl: process.env.NEXT_PUBLIC_SURVEY_API_URL!,
	serviceType: SERVICE_TYPES.SURVEY,
});

export async function withHealthCheck<T>(
	fn: () => Promise<T>,
	serviceType: ServiceType,
	errorMessage: string = `${serviceType === SERVICE_TYPES.USER ? "User" : "Survey"} service is currently unavailable.`,
): Promise<T> {
	const healthState = HealthService.getServicesHealth();

	if (!healthState[serviceType].isHealthy) {
		if (serviceType === SERVICE_TYPES.USER) {
			await HealthService.checkUserServiceHealth();
		} else if (serviceType === SERVICE_TYPES.SURVEY) {
			await HealthService.checkSurveyServiceHealth();
		} else {
			throw new Error(`Unknown service type: ${serviceType}`);
		}

		const updatedHealth = HealthService.getServicesHealth();

		if (!updatedHealth[serviceType].isHealthy) {
			throw new Error(errorMessage);
		}
	}

	try {
		return await fn();
	} catch (error) {
		throw error;
	}
}
