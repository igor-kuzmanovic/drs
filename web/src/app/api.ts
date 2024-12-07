import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
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

export const api = createApi({
	baseQuery,
	endpoints: () => ({}),
});
