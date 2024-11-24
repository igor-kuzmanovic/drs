import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api' }),
	endpoints: (builder) => ({
		ping: builder.mutation({
			query: (body) => ({
				url: '/_ping',
				method: 'POST',
				body,
			}),
		}),
	}),
});

export const { usePingMutation } = api;
