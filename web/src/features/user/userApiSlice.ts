import { api } from '../../app/api';

interface PostUserRequest {
	firstName: string;
	lastName: string;
	address: string;
	city: string;
	country: string;
	phone: string;
	email: string;
	password: string;
	passwordConfirm: string;
}

interface PostUserResponse {
	id: string;
	firstName: string;
	lastName: string;
	address: string;
	city: string;
	country: string;
	phone: string;
	email: string;
}

export const userApiSlice = api.injectEndpoints({
	endpoints: (builder) => ({
		postUser: builder.mutation<PostUserResponse, PostUserRequest>({
			query: (body: PostUserRequest) => ({
				url: '/users',
				method: 'POST',
				body: {
					firstName: body.firstName,
					lastName: body.lastName,
					address: body.address,
					city: body.city,
					country: body.country,
					phone: body.phone,
					email: body.email,
					password: body.password,
					passwordConfirm: body.passwordConfirm,
				},
			}),
		}),
	}),
});

export const { usePostUserMutation } = userApiSlice;
