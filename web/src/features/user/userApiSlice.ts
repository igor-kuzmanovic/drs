import { api } from '../../app/api';

type GetUserRequest = void;

interface GetUserResponse {
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
}

export const userApiSlice = api.injectEndpoints({
	endpoints: (builder) => ({
		getUser: builder.query<GetUserResponse, GetUserRequest>({
			query: () => ({
				url: `/user`,
				method: 'GET',
			}),
		}),
	}),
});

export const { useGetUserQuery } = userApiSlice;
