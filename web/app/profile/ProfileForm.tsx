"use client";

import React, { useState } from "react";
import { useUser } from "../_context/UserContext";
import Input from "../_components/Input";
import Button from "../_components/Button";
import { printError } from "../_lib/error";

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

type User = {
	firstName?: string;
	lastName?: string;
	address?: string;
	city?: string;
	country?: string;
	phone?: string;
};

const getInitialValues = (user: User | null | undefined): FormValues => ({
	firstName: user?.firstName || "",
	lastName: user?.lastName || "",
	address: user?.address || "",
	city: user?.city || "",
	country: user?.country || "",
	phone: user?.phone || "",
	password: "",
	passwordConfirm: "",
});

export default function ProfileForm() {
	const { user, refreshUser } = useUser();
	const [values, setValues] = useState<FormValues>(getInitialValues(user));
	const [errors, setErrors] = useState<Partial<FormValues>>({});
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	if (!user) return <div>Loading...</div>;

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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValues({ ...values, [e.target.name]: e.target.value });
		setErrors({ ...errors, [e.target.name]: undefined });
		setError(null);
		setSuccess(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);
		const validationErrors = validate(values);
		setErrors(validationErrors);
		if (Object.keys(validationErrors).length > 0) return;

		setLoading(true);
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_USER_API_URL}/user`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({
					firstName: values.firstName,
					lastName: values.lastName,
					address: values.address,
					city: values.city,
					country: values.country,
					phone: values.phone,
					password: values.password ? values.password : undefined,
				}),
			});
			const data = await res.json();
			if (!res.ok) {
				setError(data.error || "Update failed");
			} else {
				setSuccess("Profile updated!");
				await refreshUser();
				setValues({ ...values, password: "", passwordConfirm: "" });
			}
		} catch (err) {
			setError(printError(err));
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			className="flex flex-col gap-6 w-full max-w-2xl mx-auto"
			onSubmit={handleSubmit}
			noValidate
		>
			<h1 className="text-2xl font-bold mb-2">Edit Profile</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Input
					id="firstName"
					name="firstName"
					label="First name"
					autoComplete="given-name"
					placeholder="John"
					value={values.firstName}
					onChange={handleChange}
					disabled={loading}
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
					disabled={loading}
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
					disabled={loading}
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
					disabled={loading}
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
					disabled={loading}
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
					disabled={loading}
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
					disabled={loading}
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
					disabled={loading}
					error={errors.passwordConfirm}
				/>
			</div>
			<Button type="submit" fullWidth loading={loading}>
				Save Changes
			</Button>
			{error && (
				<div className="bg-red-100 text-red-700 px-4 py-2 rounded mt-2 text-center">
					{error}
				</div>
			)}
			{success && (
				<div className="bg-green-100 text-green-700 px-4 py-2 rounded mt-2 text-center">
					{success}
				</div>
			)}
		</form>
	);
}
