const USER_API_BASE = process.env.NEXT_PUBLIC_USER_API_URL!;
const SURVEY_API_BASE = process.env.NEXT_PUBLIC_SURVEY_API_URL!;

async function apiFetch<T>(
	base: string,
	url: string,
	options: RequestInit = {},
): Promise<T> {
	const token =
		typeof window !== "undefined" ? localStorage.getItem("token") : null;

	const headers: HeadersInit = {
		Accept: "application/json",
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...(options.headers || {}),
	};

	const res = await fetch(`${base}${url}`, {
		...options,
		headers,
	});
	const contentType = res.headers.get("content-type");
	let errorData: unknown = null;
	if (!res.ok) {
		if (contentType && contentType.includes("application/json")) {
			errorData = await res.json();
		} else {
			errorData = { error: res.statusText };
		}
		throw {
			status: res.status,
			data: errorData,
		};
	}
	return res.json();
}

// --- USER API ---

export type User = {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	address: string;
	city: string;
	country: string;
	phone: string;
	createdAt: string;
	updatedAt: string;
};

export type UserProfileUpdate = Partial<
	Pick<
		User,
		"firstName" | "lastName" | "address" | "city" | "country" | "phone"
	>
> & { password?: string };

export async function getUser(): Promise<User> {
	return apiFetch<User>(USER_API_BASE, "/api/user", { method: "GET" });
}

export async function updateUser(data: UserProfileUpdate): Promise<User> {
	return apiFetch<User>(USER_API_BASE, "/api/user", {
		method: "PUT",
		body: JSON.stringify(data),
	});
}

export type SignupRequest = {
	firstName: string;
	lastName: string;
	address: string;
	city: string;
	country: string;
	phone: string;
	email: string;
	password: string;
	passwordConfirm: string;
};
export type SignupResponse = { token: string };

export async function signupUser(data: SignupRequest): Promise<SignupResponse> {
	return apiFetch<SignupResponse>(USER_API_BASE, "/api/users", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export type LoginRequest = { email: string; password: string };
export type LoginResponse = { token: string };

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
	return apiFetch<LoginResponse>(USER_API_BASE, "/api/auth/login", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

// --- SURVEY API ---

export type Survey = {
	id: string;
	name: string;
	question: string;
	endDate: string;
	isAnonymous: boolean;
	recipients: string[];
	status: SurveyStatusType;
	createdAt: string;
	updatedAt: string;
	results: Record<SurveyAnswerType, number>;
	respondentEmails?: string[] | null;
	emailStatus?: EmailTaskInfo[]; // for detail
	emailStatusSummary?: EmailStatusSummary; // for list
};

export type CreateSurveyRequest = {
	name: string;
	question: string;
	endDate: string;
	isAnonymous: boolean;
	recipients: string[];
};
export type CreateSurveyResponse = Survey;

export async function getSurveys({
	name = "",
	page = 1,
	pageSize = 20,
}: { name?: string; page?: number; pageSize?: number } = {}) {
	const params = new URLSearchParams();
	if (name) params.append("name", name);
	params.append("page", String(page));
	params.append("pageSize", String(pageSize));
	return apiFetch<{
		items: Survey[];
		total: number;
		page: number;
		pageSize: number;
	}>(SURVEY_API_BASE, `/api/surveys?${params.toString()}`, { method: "GET" });
}

export async function createSurvey(
	data: CreateSurveyRequest,
): Promise<CreateSurveyResponse> {
	return apiFetch<CreateSurveyResponse>(SURVEY_API_BASE, "/api/surveys", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function terminateSurvey(id: string): Promise<void> {
	await apiFetch<void>(SURVEY_API_BASE, `/api/surveys/${id}/terminate`, {
		method: "POST",
	});
}

export async function deleteSurvey(id: string): Promise<void> {
	await apiFetch<void>(SURVEY_API_BASE, `/api/surveys/${id}`, {
		method: "DELETE",
	});
}

export async function getSurvey(id: string): Promise<Survey> {
	return apiFetch<Survey>(SURVEY_API_BASE, `/api/surveys/${id}`, {
		method: "GET",
	});
}

export type SurveyResultResponse = {
	surveyId: string;
	results: Record<SurveyAnswerType, number>;
	totalResponses: number;
	responses: {
		respondentEmail: string | null;
		answer: SurveyAnswerType;
		answeredAt: string;
	}[];
};

export async function getSurveyResults(
	id: string,
): Promise<SurveyResultResponse> {
	return apiFetch<SurveyResultResponse>(
		SURVEY_API_BASE,
		`/api/surveys/${id}/results`,
		{
			method: "GET",
		},
	);
}

export type PublicSurvey = {
	id: string;
	name: string;
	question: string;
	endDate: string;
	isAnonymous: boolean;
	status: SurveyStatusType;
	createdAt: string;
	updatedAt: string;
};

export async function getPublicSurvey(id: string): Promise<PublicSurvey> {
	return apiFetch<PublicSurvey>(SURVEY_API_BASE, `/api/surveys/${id}/public`, {
		method: "GET",
	});
}

export const SurveyStatus = {
	Active: "ACTIVE",
	Closed: "CLOSED",
} as const;

export type SurveyStatusType = (typeof SurveyStatus)[keyof typeof SurveyStatus];

export const SurveyAnswer = {
	Yes: "YES",
	No: "NO",
	CantAnswer: "CANT_ANSWER",
} as const;

export type SurveyAnswerType = (typeof SurveyAnswer)[keyof typeof SurveyAnswer];

export type SurveyRespondRequest =
	| { email: string; answer: SurveyAnswerType }
	| { token: string; answer: SurveyAnswerType };
export type SurveyRespondResponse = { message: string };

export async function respondSurvey(
	surveyId: string,
	data: SurveyRespondRequest,
): Promise<SurveyRespondResponse> {
	return apiFetch<SurveyRespondResponse>(
		SURVEY_API_BASE,
		`/api/surveys/${surveyId}/respond`,
		{
			method: "POST",
			body: JSON.stringify(data),
		},
	);
}

export type EmailTaskStatus = "PENDING" | "SENT" | "FAILED";

export type EmailTaskInfo = {
	recipient: string;
	status: EmailTaskStatus;
	sentAt: string | null;
};

export type EmailStatusSummary = {
	sent: number;
	pending: number;
	failed: number;
	total: number;
};

export async function retrySurveyFailedEmails(surveyId: string): Promise<void> {
	await apiFetch<void>(
		SURVEY_API_BASE,
		`/api/surveys/${surveyId}/retry-failed-emails`,
		{ method: "POST" },
	);
}
