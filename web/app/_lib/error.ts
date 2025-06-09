export interface HttpError {
	data: {
		error: string;
	};
	status: number;
}

export const isHttpError = (error: unknown): error is HttpError => {
	return (
		typeof error === "object" &&
		error !== null &&
		"status" in error &&
		typeof error.status === "number" &&
		"data" in error &&
		typeof error.data === "object" &&
		error.data !== null &&
		"error" in error.data &&
		typeof error.data.error === "string"
	);
};

export const printHttpError = (error: HttpError): string => {
	return error.data.error;
};

export interface BadRequestHttpError extends HttpError {
	status: 400;
}

export const isBadRequestHttpError = (
	error: unknown,
): error is BadRequestHttpError => {
	return isHttpError(error) && error.status === 400;
};

export const printBadRequestHttpError = (
	error: BadRequestHttpError,
): string => {
	return printHttpError(error);
};

export interface ValidationError extends BadRequestHttpError {
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
}

export const isValidationError = (error: unknown): error is ValidationError => {
	return (
		isBadRequestHttpError(error) &&
		typeof error.data === "object" &&
		error.data !== null &&
		(("messages" in error.data && Array.isArray(error.data.messages)) ||
			!("messages" in error.data))
	);
};

export const printValidationError = (error: ValidationError): string => {
	let messages;
	if (error.data.messages) {
		messages = error.data.messages
			?.map((error) => {
				const field = Array.isArray(error.loc)
					? error.loc.join(".")
					: "unknown field";
				return `${field}: ${error.msg}`;
			})
			.join(", \n");
	}

	return messages
		? `${printBadRequestHttpError(error)}: ${messages}`
		: printBadRequestHttpError(error);
};

export interface InternalServerHttpError extends HttpError {
	status: 500;
}

export const isInternalServerHttpError = (
	error: unknown,
): error is InternalServerHttpError => {
	return isHttpError(error) && error.status === 500;
};

export const printInternalServerError = (
	error: InternalServerHttpError,
): string => {
	if (isHttpError(error)) {
		return printHttpError(error);
	}

	return "Internal server error";
};

export const printError = (error: unknown): string => {
	if (isInternalServerHttpError(error)) {
		return printInternalServerError(error);
	} else if (isValidationError(error)) {
		return printValidationError(error);
	} else if (isHttpError(error)) {
		return printHttpError(error);
	} else if (typeof error === "string") {
		return error;
	} else if (error instanceof Error) {
		return error.message;
	} else {
		console.error(`Unhandled error type: ${typeof error}`, error);
		return "Unknown error";
	}
};
