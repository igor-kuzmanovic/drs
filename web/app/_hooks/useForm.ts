import { useState, ChangeEvent, FormEvent } from "react";
import { printError, isValidationError } from "../_lib/error";
import { capitalizeFirstLetter } from "../_lib/utils";

type ValidationFunction<T> = (values: T) => Partial<Record<keyof T, string>>;

interface UseFormOptions<T extends Record<string, unknown>> {
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
	const [formErrors, setFormErrors] = useState<
		Partial<Record<keyof T, string>>
	>({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value, type } = e.target;
		const newValue =
			type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

		setValues({ ...values, [name]: newValue });
		setFormErrors({});
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		setFormErrors({});

		if (validate) {
			const validationErrors = validate(values);
			setFormErrors(validationErrors);
			if (Object.keys(validationErrors).length > 0) return;
		}

		setLoading(true);
		try {
			await onSubmit(values);
		} catch (err) {
			if (isValidationError(err) && err.data.messages?.length) {
				const fieldErrors: Partial<Record<keyof T, string>> = {};

				err.data.messages.forEach((message) => {
					if (message.loc && message.loc.length > 0) {
						const fieldName = message.loc[0];
						if (typeof fieldName === "string" && fieldName in values) {
							fieldErrors[fieldName as keyof T] = capitalizeFirstLetter(
								message.msg || "Invalid value",
							);
						}
					}
				});

				if (Object.keys(fieldErrors).length > 0) {
					setFormErrors(fieldErrors);
				} else {
					setError(printError(err));
				}
			} else {
				setError(printError(err));
			}
		} finally {
			setLoading(false);
		}
	};

	const setValue = <K extends keyof T>(field: K, value: T[K]) => {
		setValues({ ...values, [field]: value });
		setFormErrors({});
	};

	return {
		values,
		formErrors,
		loading,
		error,
		handleChange,
		handleSubmit,
		setValue,
		setValues,
		setError,
	};
}
