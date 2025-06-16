import { LoginRequest, SignupRequest } from "./models";
import UserService from "./user";

const TOKEN_KEY = "token";

export const AuthService = {
	getToken: (): string | null => {
		if (typeof window === "undefined") return null;
		return localStorage.getItem(TOKEN_KEY);
	},

	setToken: (token: string): void => {
		if (typeof window === "undefined") return;
		localStorage.setItem(TOKEN_KEY, token);
		// Trigger storage event for other tabs
		window.dispatchEvent(new Event("storage"));
	},

	removeToken: (): void => {
		if (typeof window === "undefined") return;
		localStorage.removeItem(TOKEN_KEY);
		// Trigger storage event for other tabs
		window.dispatchEvent(new Event("storage"));
	},

	isAuthenticated: (): boolean => {
		return !!AuthService.getToken();
	},

	login: async (credentials: LoginRequest): Promise<void> => {
		const response = await UserService.login(credentials);
		AuthService.setToken(response.token);
	},

	signup: async (data: SignupRequest): Promise<void> => {
		const response = await UserService.signup(data);
		AuthService.setToken(response.token);
	},

	logout: (): void => {
		AuthService.removeToken();
	},
};

export default AuthService;
