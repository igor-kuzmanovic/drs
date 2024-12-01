import { api } from '../../app/api';

interface LoginQuery {
	email: string;
	password: string;
}

interface LoginResult {
	token: string;
}

export const authApiSlice = api.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation<LoginResult, LoginQuery>({
			query: (body: { email: string; password: string }) => ({
				url: '/login',
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
