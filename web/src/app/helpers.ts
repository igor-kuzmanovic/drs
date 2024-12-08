export interface GenericError {
	data: {
		error: string;
	};
	status: number;
}

export interface ValidationError {
	data: {
		error: string;
		messages?: {
			input: object;
			loc: (string | number)[];
			msg: string;
			type: string;
			url: string;
		}[];
	};
	status: 400;
}

export const isGenericError = (error: unknown): error is GenericError => {
	return (
		typeof error === 'object' &&
		error !== null &&
		'status' in error &&
		typeof error.status === 'number' &&
		'data' in error &&
		typeof error.data === 'object' &&
		error.data !== null &&
		'error' in error.data &&
		typeof error.data.error === 'string'
	);
};

export const isValidationError = (error: unknown): error is ValidationError => {
	return (
		isGenericError(error) &&
		error.status === 400 &&
		(('messages' in error.data && Array.isArray(error.data.messages)) || !('messages' in error.data))
	);
};

export const mapGenericErrorToString = (error: GenericError): string => {
	return error.data.error;
};

export const mapValidationErrorToString = (error: ValidationError) => {
	let messages;
	if (error.data.messages) {
		messages = error.data.messages
			?.map((error) => {
				const field = Array.isArray(error.loc) ? error.loc.join('.') : 'unknown field';
				return `${field}: ${error.msg}`;
			})
			.join(', \n');
	}

	return messages ? `${mapGenericErrorToString(error)}: ${messages}` : mapGenericErrorToString(error);
};

export const mapErrorToString = (error: unknown) => {
	if (isValidationError(error)) {
		return mapValidationErrorToString(error);
	} else if (isGenericError(error)) {
		return mapGenericErrorToString(error);
	} else {
		return String(error);
	}
};
