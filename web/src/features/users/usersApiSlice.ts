import { api } from '../../app/api';

interface PostUserRequest {
	email: string;
	password: string;
	passwordConfirm: string;
	firstName: string;
	lastName: string;
	address: string;
	city: string;
	country: string;
	phone: string;
}

interface PostUserResponse {
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

export const usersApiSlice = api.injectEndpoints({
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

export const { usePostUserMutation } = usersApiSlice;
