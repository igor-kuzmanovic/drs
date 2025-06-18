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

const getInitialValues = (user: User): FormValues => ({
	firstName: user.firstName || "",
	lastName: user.lastName || "",
	address: user.address || "",
	city: user.city || "",
	country: user.country || "",
	phone: user.phone || "",
	password: "",
	passwordConfirm: "",
});

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

	const validate = (vals: FormValues) => {
		const errs: Partial<FormValues> = {};
		if (vals.firstName.length < 3) errs.firstName = "Invalid first name";
		if (vals.lastName.length < 3) errs.lastName = "Invalid last name";
		if (vals.address.length < 3) errs.address = "Invalid address";
		if (vals.city.length < 3) errs.city = "Invalid city";
		if (vals.country.length < 3) errs.country = "Invalid country";
		if (vals.phone.length < 3) errs.phone = "Invalid phone";
		if (vals.password && vals.password.length < 3)
			errs.password = "Password too short";
		if (vals.password && vals.password !== vals.passwordConfirm)
			errs.passwordConfirm = "Passwords do not match";
		return errs;
	};

	const {
		values,
		errors,
		error,
		loading,
		handleChange,
		handleSubmit,
		setValues,
	} = useForm<FormValues>({
		initialValues: getInitialValues(user),
		validate,
		onSubmit: async (formValues) => {
			const updateData = {
				firstName: formValues.firstName,
				lastName: formValues.lastName,
				address: formValues.address,
				city: formValues.city,
				country: formValues.country,
				phone: formValues.phone,
				password: formValues.password ? formValues.password : undefined,
			};

			await UserService.updateUser(updateData);
			showToast("Profile updated successfully!", TOAST_TYPES.SUCCESS);
			onUserUpdated();
			setValues({ ...formValues, password: "", passwordConfirm: "" });
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
					error={errors.firstName}
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
					error={errors.lastName}
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
					error={errors.address}
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
					error={errors.city}
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
					error={errors.country}
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
					error={errors.phone}
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
					error={errors.password}
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
					error={errors.passwordConfirm}
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
			{error && <Alert type="error">{error}</Alert>}
		</form>
	);
}
