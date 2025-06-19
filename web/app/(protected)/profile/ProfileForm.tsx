"use client";

import React from "react";
import Input from "../../_components/Input";
import Action from "../../_components/Action";
import Alert from "../../_components/Alert";
import { useForm } from "../../_hooks/useForm";
import { TOAST_TYPES, useToast } from "../../_context/ToastContext";
import { User } from "../../_lib/models";
import UserService from "../../_lib/user";
import { SERVICE_TYPES } from "../../_lib/health";

type FormValues = {
	firstName: string;
	lastName: string;
	address: string;
	city: string;
	country: string;
	phone: string;
	password: string;
	passwordConfirm: string;
};

export default function ProfileForm({
	user,
	onUserUpdated,
	disabled = false,
}: {
	user: User;
	onUserUpdated: () => void;
	disabled?: boolean;
}) {
	const { showToast } = useToast();

	const {
		values,
		formErrors,
		loading,
		error,
		handleChange,
		handleSubmit,
		setValues,
	} = useForm<FormValues>({
		initialValues: {
			firstName: user.firstName || "",
			lastName: user.lastName || "",
			address: user.address || "",
			city: user.city || "",
			country: user.country || "",
			phone: user.phone || "",
			password: "",
			passwordConfirm: "",
		},
		validate: (values: FormValues) => {
			const errors: Record<string, string> = {};
			if (values.firstName.length < 3)
				errors.firstName = "First name must be at least 3 characters";
			if (values.lastName.length < 3)
				errors.lastName = "Last name must be at least 3 characters";
			if (values.address.length < 3)
				errors.address = "Address must be at least 3 characters";
			if (values.city.length < 3)
				errors.city = "City must be at least 3 characters";
			if (values.country.length < 3)
				errors.country = "Country must be at least 3 characters";
			if (values.phone.length < 3)
				errors.phone = "Phone must be at least 3 characters";
			if (values.password && values.password.length < 3)
				errors.password = "Password must be at least 3 characters";
			if (values.password && values.password !== values.passwordConfirm)
				errors.passwordConfirm = "Passwords do not match";
			return errors;
		},
		onSubmit: async (values) => {
			await UserService.updateUser({
				firstName: values.firstName,
				lastName: values.lastName,
				address: values.address,
				city: values.city,
				country: values.country,
				phone: values.phone,
				password: values.password ? values.password : undefined,
			});
			showToast("Profile updated successfully!", TOAST_TYPES.SUCCESS);
			onUserUpdated();
			setValues({ ...values, password: "", passwordConfirm: "" });
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
				<Input
					id="password"
					name="password"
					label="New password"
					type="password"
					autoComplete="new-password"
					placeholder="Leave blank to keep current"
					value={values.password}
					onChange={handleChange}
					disabled={loading || disabled}
					error={formErrors.password}
				/>
				<Input
					id="passwordConfirm"
					name="passwordConfirm"
					label="Confirm new password"
					type="password"
					autoComplete="new-password"
					placeholder="Repeat new password"
					value={values.passwordConfirm}
					onChange={handleChange}
					disabled={loading || disabled}
					error={formErrors.passwordConfirm}
				/>
			</div>
			<Action
				type="submit"
				fullWidth
				loading={loading}
				disabled={disabled}
				requiredService={disabled ? SERVICE_TYPES.USER : undefined}
				disabledMessage="The user service is currently unavailable. Profile editing is disabled."
			>
				Save Changes
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
