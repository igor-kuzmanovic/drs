import { userApiClient } from "./apiClient";
import { User, UserProfileUpdate, LoginRequest, SignupRequest } from "./models";

export const UserService = {
	getUser: async (): Promise<User> => {
		return await userApiClient.get<User>("/api/user");
	},

	updateUser: async (data: UserProfileUpdate): Promise<User> => {
		return await userApiClient.put<User>("/api/user", data);
	},

	login: async (credentials: LoginRequest): Promise<{ token: string }> => {
		return await userApiClient.post<{ token: string }>(
			"/api/auth/login",
			credentials,
		);
	},

	signup: async (data: SignupRequest): Promise<{ token: string }> => {
		return await userApiClient.post<{ token: string }>("/api/users", data);
	},
};

export default UserService;
