import { useState, ChangeEvent, FormEvent } from "react";

type ValidationFunction<T> = (values: T) => Partial<Record<keyof T, string>>;

interface UseFormOptions<T> {
	initialValues: T;
	validate?: ValidationFunction<T>;
	onSubmit: (values: T) => Promise<void>;
}

export function useForm<T extends Record<string, unknown>>({
	initialValues,
	validate,
	onSubmit,
}: UseFormOptions<T>) {
	const [values, setValues] = useState<T>(initialValues);
	const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value, type } = e.target;
		const newValue =
			type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

		setValues({ ...values, [name]: newValue });

		if (errors[name as keyof T]) {
			setErrors({ ...errors, [name]: undefined });
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);

		if (validate) {
			const validationErrors = validate(values);
			setErrors(validationErrors);
			if (Object.keys(validationErrors).length > 0) return;
		}

		setLoading(true);
		try {
			await onSubmit(values);
		} catch (err) {
			if (typeof err === "string") {
				setError(err);
			} else if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An unknown error occurred");
			}
		} finally {
			setLoading(false);
		}
	};

	const setValue = <K extends keyof T>(field: K, value: T[K]) => {
		setValues({ ...values, [field]: value });
		if (errors[field]) {
			setErrors({ ...errors, [field]: undefined });
		}
	};

	return {
		values,
		errors,
		loading,
		error,
		handleChange,
		handleSubmit,
		setValue,
		setValues,
		setError,
	};
}
