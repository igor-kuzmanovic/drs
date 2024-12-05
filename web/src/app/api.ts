import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logOut, setCredentials } from '../features/auth/authSlice';
import type { RootState } from './store';

const baseQuery = fetchBaseQuery({
	baseUrl: 'http://localhost:5000/api',
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).auth.token;
		if (token) {
			headers.set('Authorization', `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithTokenRefresh: BaseQueryFn = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);

	if (
		result?.error &&
		(('status' in result.error && result.error.status === 403) ||
			('originalStatus' in result.error && result.error.originalStatus === 403))
	) {
		// Send refresh token to get new access token
		const refreshResult = await baseQuery({ url: '/auth/refresh', method: 'POST' }, api, extraOptions);
		if (
			refreshResult?.data &&
			typeof refreshResult.data === 'object' &&
			'token' in refreshResult.data &&
			refreshResult.data.token
		) {
			// Store the new token
			api.dispatch(setCredentials({ token: refreshResult.data.token }));
			// Retry the original query with new access token
			result = await baseQuery(args, api, extraOptions);
		} else {
			api.dispatch(logOut());
		}
	}

	return result;
};

export const api = createApi({
	baseQuery: baseQueryWithTokenRefresh,
	endpoints: () => ({}),
});
