import AuthService from "./auth";

interface ApiClientOptions {
	baseUrl: string;
}

export class ApiClient {
	private baseUrl: string;

	constructor(options: ApiClientOptions) {
		this.baseUrl = options.baseUrl;
	}

	async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const token = AuthService.getToken();

		const headers: HeadersInit = {
			Accept: "application/json",
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...(options.headers || {}),
		};

		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			...options,
			headers,
		});

		// Handle 401 Unauthorized globally
		if (response.status === 401) {
			AuthService.removeToken();
			window.location.href = "/login";
			throw {
				status: 401,
				data: { error: "Authentication failed. Please log in again." },
			};
		}
		const contentType = response.headers.get("content-type");
		let data: unknown;

		if (contentType && contentType.includes("application/json")) {
			data = await response.json();
		} else {
			data = await response.text();
		}

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
	}

	async get<T>(
		endpoint: string,
		queryParams: Record<string, string | number | boolean> = {},
	): Promise<T> {
		const params = new URLSearchParams();

		Object.entries(queryParams).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				params.append(key, String(value));
			}
		});

		const queryString = params.toString();
		const url = queryString ? `${endpoint}?${queryString}` : endpoint;

		return this.request<T>(url, { method: "GET" });
	}

	async post<T>(endpoint: string, data?: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: "POST",
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async put<T>(endpoint: string, data?: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: "PUT",
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async delete<T>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint, { method: "DELETE" });
	}
}

export const userApiClient = new ApiClient({
	baseUrl: process.env.NEXT_PUBLIC_USER_API_URL!,
});

export const surveyApiClient = new ApiClient({
	baseUrl: process.env.NEXT_PUBLIC_SURVEY_API_URL!,
});
