import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export const isFetchBaseQueryError = (
	error: unknown,
): error is FetchBaseQueryError => typeof error === 'object' && error != null && 'status' in error;

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export const isErrorWithMessage = (
	error: unknown,
): error is { message: string } => (
	typeof error === 'object' &&
	error != null &&
	'message' in error &&
	typeof error.message === 'string'
);
