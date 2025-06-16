import { useState } from "react";
import { printError } from "../_lib/error";

interface UseApiCallOptions {
	onSuccess?: () => void;
	onError?: (error: string) => void;
}

export function useApiCall<TArgs extends Array<unknown>, TReturn>(
	apiFunction: (...args: TArgs) => Promise<TReturn>,
	options?: UseApiCallOptions,
) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const execute = async (...args: TArgs): Promise<TReturn | null> => {
		setLoading(true);
		setError(null);

		try {
			const result = await apiFunction(...args);
			options?.onSuccess?.();
			return result;
		} catch (err) {
			const errorMessage = printError(err);
			setError(errorMessage);
			options?.onError?.(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	};

	return {
		execute,
		loading,
		error,
		setError,
	};
}
