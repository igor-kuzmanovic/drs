export interface ValidationError {
	data: {
		error: string;
		messages: {
			input: object;
			loc: (string | number)[];
			msg: string;
			type: string;
			url: string;
		}[];
	};
	status: 400;
}

export const isValidationError = (error: unknown): error is ValidationError =>
	typeof error === 'object' &&
	error !== null &&
	'status' in error &&
	typeof error.status === 'number' &&
	error.status === 400 &&
	'data' in error &&
	typeof error.data === 'object' &&
	error.data !== null &&
	'error' in error.data &&
	typeof error.data.error === 'string' &&
	'messages' in error.data &&
	Array.isArray(error.data.messages);

export const mapValidationErrorToString = (error: ValidationError) =>
	error.data.messages
		.map((error) => {
			const field = Array.isArray(error.loc) ? error.loc.join('.') : 'unknown field';
			return `${field}: ${error.msg}`;
		})
		.join(', \n');
