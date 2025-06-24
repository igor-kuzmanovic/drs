import { userApiClient, withHealthCheck } from "./apiClient";
import { User, UserProfileUpdate, LoginRequest, SignupRequest } from "./models";
import { SERVICE_TYPES } from "./health";

export const UserService = {
	getUser: async (): Promise<User> => {
		return withHealthCheck(
			() => userApiClient.get<User>("/api/users/me"),
			SERVICE_TYPES.USER,
		);
	},

	updateUser: async (data: UserProfileUpdate): Promise<User> => {
		return withHealthCheck(
			() => userApiClient.put<User>("/api/users/me", data),
			SERVICE_TYPES.USER,
		);
	},

	login: async (credentials: LoginRequest): Promise<{ token: string }> => {
		return withHealthCheck(
			() =>
				userApiClient.post<{ token: string }>("/api/login", credentials),
			SERVICE_TYPES.USER,
		);
	},

	signup: async (data: SignupRequest): Promise<{ token: string }> => {
		return withHealthCheck(
			() => userApiClient.post<{ token: string }>("/api/users", data),
			SERVICE_TYPES.USER,
		);
	},
};

export default UserService;
