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

export type LoginRequest = { email: string; password: string };
export type LoginResponse = { token: string };

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

export const SURVEY_STATUS = {
	ACTIVE: "ACTIVE",
	CLOSED: "CLOSED",
} as const;

export type SurveyStatusType =
	(typeof SURVEY_STATUS)[keyof typeof SURVEY_STATUS];

export const SURVEY_ANSWER = {
	YES: "YES",
	NO: "NO",
	CANT_ANSWER: "CANT_ANSWER",
} as const;

export type SurveyAnswerType =
	(typeof SURVEY_ANSWER)[keyof typeof SURVEY_ANSWER];

export type SurveyRespondRequest =
	| { email: string; answer: SurveyAnswerType }
	| { token: string; answer: SurveyAnswerType };
export type SurveyRespondResponse = { message: string };

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
