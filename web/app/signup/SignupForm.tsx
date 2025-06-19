"use client";

import React from "react";
import Input from "../_components/Input";
import Action from "../_components/Action";
import Alert from "../_components/Alert";
import { useForm } from "../_hooks/useForm";
import AuthService from "../_lib/auth";
import { TOAST_TYPES, useToast } from "../_context/ToastContext";
import { SERVICE_TYPES } from "../_lib/health";

type FormValues = {
	firstName: string;
	lastName: string;
	address: string;
	city: string;
	country: string;
	phone: string;
	email: string;
	password: string;
	passwordConfirm: string;
};

export default function SignupForm({
	onUserUpdated,
	onSuccess,
	disabled = false,
}: {
	onUserUpdated: () => Promise<void>;
	onSuccess: () => void;
	disabled?: boolean;
}) {
	const { showToast } = useToast();

	const { values, formErrors, loading, error, handleChange, handleSubmit } =
		useForm<FormValues>({
			initialValues: {
				firstName: "",
				lastName: "",
				address: "",
				city: "",
				country: "",
				phone: "",
				email: "",
				password: "",
				passwordConfirm: "",
			},
			validate: (values: FormValues) => {
				const errors: Record<string, string> = {};
				if (values.firstName.length <= 2)
					errors.firstName = "First name must be at least 3 characters";
				if (values.lastName.length <= 2)
					errors.lastName = "Last name must be at least 3 characters";
				if (values.address.length <= 2)
					errors.address = "Address must be at least 3 characters";
				if (values.city.length <= 2)
					errors.city = "City must be at least 3 characters";
				if (values.country.length <= 2)
					errors.country = "Country must be at least 3 characters";
				if (values.phone.length <= 2)
					errors.phone = "Phone must be at least 3 characters";
				if (values.email.length <= 2)
					errors.email = "Please enter a valid email address";
				if (values.password.length <= 2)
					errors.password = "Password must be at least 3 characters";
				if (
					values.passwordConfirm.length <= 2 ||
					values.passwordConfirm !== values.password
				)
					errors.passwordConfirm = "Passwords do not match";
				return errors;
			},
			onSubmit: async (values) => {
				await AuthService.signup(values);
				await onUserUpdated();
				showToast("Signup successful!", TOAST_TYPES.SUCCESS);
				onSuccess();
			},
		});

	return (
		<form
			className="flex flex-col gap-6 w-full max-w-2xl mx-auto"
			onSubmit={handleSubmit}
			noValidate
		>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Input
					id="email"
					name="email"
					label="Email"
					type="email"
					autoComplete="email"
					placeholder="john.doe@email.com"
					value={values.email}
					onChange={handleChange}
					disabled={loading || disabled}
					error={formErrors.email}
				/>
				<Input
					id="password"
					name="password"
					label="Password"
					type="password"
					autoComplete="new-password"
					placeholder="p@ssw0rd"
					value={values.password}
					onChange={handleChange}
					disabled={loading || disabled}
					error={formErrors.password}
				/>
				<Input
					id="passwordConfirm"
					name="passwordConfirm"
					label="Password confirm"
					type="password"
					autoComplete="new-password"
					placeholder="p@ssw0rd"
					value={values.passwordConfirm}
					onChange={handleChange}
					disabled={loading || disabled}
					error={formErrors.passwordConfirm}
				/>
				<Input
					id="firstName"
					name="firstName"
					label="First name"
					autoComplete="given-name"
					placeholder="John"
					value={values.firstName}
					onChange={handleChange}
					disabled={loading || disabled}
					error={formErrors.firstName}
				/>
				<Input
					id="lastName"
					name="lastName"
					label="Last name"
					autoComplete="family-name"
					placeholder="Doe"
					value={values.lastName}
					onChange={handleChange}
					disabled={loading || disabled}
					error={formErrors.lastName}
				/>
				<Input
					id="address"
					name="address"
					label="Address"
					autoComplete="street-address"
					placeholder="221B Baker Street"
					value={values.address}
					onChange={handleChange}
					disabled={loading || disabled}
					error={formErrors.address}
				/>
				<Input
					id="city"
					name="city"
					label="City"
					autoComplete="address-level-2"
					placeholder="London"
					value={values.city}
					onChange={handleChange}
					disabled={loading || disabled}
					error={formErrors.city}
				/>
				<Input
					id="country"
					name="country"
					label="Country"
					autoComplete="country-name"
					placeholder="United Kingdom"
					value={values.country}
					onChange={handleChange}
					disabled={loading || disabled}
					error={formErrors.country}
				/>
				<Input
					id="phone"
					name="phone"
					label="Phone"
					autoComplete="tel"
					placeholder="+1 (123) 456-7890"
					value={values.phone}
					onChange={handleChange}
					disabled={loading || disabled}
					error={formErrors.phone}
				/>
			</div>
			<Action
				type="submit"
				fullWidth
				loading={loading}
				disabled={disabled}
				requiredService={disabled ? SERVICE_TYPES.USER : undefined}
				disabledMessage="Signup is currently unavailable"
			>
				Submit
			</Action>
			{Object.keys(formErrors).length > 0 && (
				<Alert type="error">Please correct the errors above.</Alert>
			)}
			{error && Object.keys(formErrors).length === 0 && (
				<Alert type="error">{error}</Alert>
			)}
		</form>
	);
}
