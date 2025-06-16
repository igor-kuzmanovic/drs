import { surveyApiClient } from "./apiClient";
import {
	Survey,
	CreateSurveyRequest,
	CreateSurveyResponse,
	SurveyResultResponse,
	PublicSurvey,
	SurveyRespondRequest,
	SurveyRespondResponse,
} from "./models";

export const SurveyService = {
	getSurveys: async ({
		name = "",
		page = 1,
		pageSize = 20,
	}: { name?: string; page?: number; pageSize?: number } = {}) => {
		const params: Record<string, string | number | boolean> = {
			page,
			pageSize,
		};
		if (name) params.name = name;

		return await surveyApiClient.get<{
			items: Survey[];
			total: number;
			page: number;
			pageSize: number;
		}>("/api/surveys", params);
	},

	createSurvey: async (
		data: CreateSurveyRequest,
	): Promise<CreateSurveyResponse> => {
		return await surveyApiClient.post<CreateSurveyResponse>(
			"/api/surveys",
			data,
		);
	},

	terminateSurvey: async (id: string): Promise<void> => {
		await surveyApiClient.post<void>(`/api/surveys/${id}/terminate`);
	},

	deleteSurvey: async (id: string): Promise<void> => {
		await surveyApiClient.delete<void>(`/api/surveys/${id}`);
	},

	getSurvey: async (id: string): Promise<Survey> => {
		return await surveyApiClient.get<Survey>(`/api/surveys/${id}`);
	},

	getSurveyResults: async (id: string): Promise<SurveyResultResponse> => {
		return await surveyApiClient.get<SurveyResultResponse>(
			`/api/surveys/${id}/results`,
		);
	},

	getPublicSurvey: async (id: string): Promise<PublicSurvey> => {
		return await surveyApiClient.get<PublicSurvey>(`/api/surveys/${id}/public`);
	},

	respondSurvey: async (
		surveyId: string,
		data: SurveyRespondRequest,
	): Promise<SurveyRespondResponse> => {
		return await surveyApiClient.post<SurveyRespondResponse>(
			`/api/surveys/${surveyId}/respond`,
			data,
		);
	},

	retrySurveyFailedEmails: async (surveyId: string): Promise<void> => {
		await surveyApiClient.post<void>(
			`/api/surveys/${surveyId}/retry-failed-emails`,
		);
	},
};

export default SurveyService;
