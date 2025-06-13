async function apiFetch<T>(
	url: string,
	options: RequestInit = {},
	api: "user" | "survey" = "user",
): Promise<T> {
	const base =
		api === "user"
			? process.env.NEXT_PUBLIC_USER_API_URL
			: process.env.NEXT_PUBLIC_SURVEY_API_URL;
	const token =
		typeof window !== "undefined" ? localStorage.getItem("token") : null;

	const headers: HeadersInit = {
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...(options.headers || {}),
	};

	const res = await fetch(`${base}${url}`, {
		...options,
		headers,
	});
	if (!res.ok) {
		let error;
		try {
			error = await res.json();
		} catch {
			error = { message: res.statusText };
		}
		throw new Error(error.message || "API error");
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
	return apiFetch<User>("/user", { method: "GET" }, "user");
}

export async function updateUser(data: UserProfileUpdate): Promise<User> {
	return apiFetch<User>(
		"/user",
		{ method: "PUT", body: JSON.stringify(data) },
		"user",
	);
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
	return apiFetch<SignupResponse>(
		"/users",
		{ method: "POST", body: JSON.stringify(data) },
		"user",
	);
}

export type LoginRequest = { email: string; password: string };
export type LoginResponse = { token: string };

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
	return apiFetch<LoginResponse>(
		"/auth/login",
		{ method: "POST", body: JSON.stringify(data) },
		"user",
	);
}

// --- SURVEY API ---

export type Survey = {
	id: string;
	name: string;
	question: string;
	endDate: string;
	isAnonymous: boolean;
	recipients: string[];
	status: string;
	createdAt: string;
	updatedAt: string;
	results?: {
		YES: number;
		NO: number;
		CANT_ANSWER: number;
		[key: string]: number;
	};
	respondentEmails?: string[] | null;
};

export type CreateSurveyRequest = {
	name: string;
	question: string;
	endDate: string;
	isAnonymous: boolean;
	recipients: string[];
};
export type CreateSurveyResponse = Survey;

export async function getSurveys(): Promise<Survey[]> {
	return apiFetch<Survey[]>("/surveys", { method: "GET" }, "survey");
}

export async function createSurvey(
	data: CreateSurveyRequest,
): Promise<CreateSurveyResponse> {
	return apiFetch<CreateSurveyResponse>(
		"/surveys",
		{ method: "POST", body: JSON.stringify(data) },
		"survey",
	);
}

export async function terminateSurvey(id: string): Promise<void> {
	await apiFetch<void>(
		`/surveys/${id}/terminate`,
		{ method: "POST" },
		"survey",
	);
}

export async function deleteSurvey(id: string): Promise<void> {
	await apiFetch<void>(`/surveys/${id}`, { method: "DELETE" }, "survey");
}

export async function getSurvey(id: string): Promise<Survey> {
	return apiFetch<Survey>(`/surveys/${id}`, { method: "GET" }, "survey");
}

export type SurveyResultResponse = {
	surveyId: string;
	results: {
		YES: number;
		NO: number;
		CANT_ANSWER: number;
		[key: string]: number;
	};
	totalResponses: number;
	responses: {
		respondentEmail: string | null;
		answer: string;
		answeredAt: string;
	}[];
};

export async function getSurveyResults(
	id: string,
): Promise<SurveyResultResponse> {
	return apiFetch<SurveyResultResponse>(
		`/surveys/${id}/results`,
		{ method: "GET" },
		"survey",
	);
}
