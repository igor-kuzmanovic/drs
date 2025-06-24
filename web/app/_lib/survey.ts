import { surveyApiClient, withHealthCheck } from "./apiClient";
import {
	Survey,
	CreateSurveyRequest,
	CreateSurveyResponse,
	SurveyResultResponse,
	PublicSurvey,
	SurveyRespondRequest,
	SurveyRespondResponse as SurveyResponseResponse,
} from "./models";
import { SERVICE_TYPES } from "./health";

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

		return withHealthCheck(
			() =>
				surveyApiClient.get<{
					items: Survey[];
					total: number;
					page: number;
					pageSize: number;
				}>("/api/surveys", params),
			SERVICE_TYPES.SURVEY,
		);
	},

	createSurvey: async (
		data: CreateSurveyRequest,
	): Promise<CreateSurveyResponse> => {
		return withHealthCheck(
			() => surveyApiClient.post<CreateSurveyResponse>("/api/surveys", data),
			SERVICE_TYPES.SURVEY,
		);
	},

	terminateSurvey: async (id: string): Promise<void> => {
		return withHealthCheck(
			() => surveyApiClient.post<void>(`/api/surveys/${id}/terminate`),
			SERVICE_TYPES.SURVEY,
		);
	},

	deleteSurvey: async (id: string): Promise<void> => {
		return withHealthCheck(
			() => surveyApiClient.delete<void>(`/api/surveys/${id}`),
			SERVICE_TYPES.SURVEY,
		);
	},

	getSurvey: async (id: string): Promise<Survey> => {
		return withHealthCheck(
			() => surveyApiClient.get<Survey>(`/api/surveys/${id}`),
			SERVICE_TYPES.SURVEY,
		);
	},

	getSurveyResults: async (id: string): Promise<SurveyResultResponse> => {
		return withHealthCheck(
			() =>
				surveyApiClient.get<SurveyResultResponse>(`/api/surveys/${id}/results`),
			SERVICE_TYPES.SURVEY,
		);
	},

	getPublicSurvey: async (id: string): Promise<PublicSurvey> => {
		return withHealthCheck(
			() => surveyApiClient.get<PublicSurvey>(`/api/surveys/${id}/public`),
			SERVICE_TYPES.SURVEY,
		);
	},

	postSurveyResponse: async (
		surveyId: string,
		data: SurveyRespondRequest,
	): Promise<SurveyResponseResponse> => {
		return withHealthCheck(
			() =>
				surveyApiClient.post<SurveyResponseResponse>(
					`/api/surveys/${surveyId}/response`,
					data,
				),
			SERVICE_TYPES.SURVEY,
		);
	},

	retrySurveyFailedEmails: async (surveyId: string): Promise<void> => {
		return withHealthCheck(
			() =>
				surveyApiClient.post<void>(
					`/api/surveys/${surveyId}/retry-failed-emails`,
				),
			SERVICE_TYPES.SURVEY,
		);
	},
};

export default SurveyService;
