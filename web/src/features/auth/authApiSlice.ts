import { api } from '../../app/api';

interface LoginRequest {
	email: string;
	password: string;
}

interface LoginResponse {
	token: string;
}

export const authApiSlice = api.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation<LoginResponse, LoginRequest>({
			query: (body: LoginRequest) => ({
				url: '/auth/login',
				method: 'POST',
				body: {
					email: body.email,
					password: body.password,
				},
			}),
		}),
	}),
});

export const { useLoginMutation } = authApiSlice;
