"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { printError } from "../_lib/error";
import { useUser } from "../_context/UserContext";
import Input from "../_components/Input";
import Button from "../_components/Button";
import { signupUser } from "../_lib/api";

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

const initialValues: FormValues = {
	firstName: "",
	lastName: "",
	address: "",
	city: "",
	country: "",
	phone: "",
	email: "",
	password: "",
	passwordConfirm: "",
};

export default function SignupForm() {
	const router = useRouter();
	const [values, setValues] = useState<FormValues>(initialValues);
	const [errors, setErrors] = useState<Partial<FormValues>>({});
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const { refreshUser } = useUser();

	const validate = (vals: FormValues) => {
		const errs: Partial<FormValues> = {};
		if (vals.firstName.length <= 2) errs.firstName = "Invalid first name";
		if (vals.lastName.length <= 2) errs.lastName = "Invalid last name";
		if (vals.address.length <= 2) errs.address = "Invalid address";
		if (vals.city.length <= 2) errs.city = "Invalid city";
		if (vals.country.length <= 2) errs.country = "Invalid country";
		if (vals.phone.length <= 2) errs.phone = "Invalid phone";
		if (vals.email.length <= 2) errs.email = "Invalid email";
		if (vals.password.length <= 2) errs.password = "Invalid password";
		if (
			vals.passwordConfirm.length <= 2 ||
			vals.passwordConfirm !== vals.password
		)
			errs.passwordConfirm = "Invalid confirm password";
		return errs;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValues({ ...values, [e.target.name]: e.target.value });
		setErrors({ ...errors, [e.target.name]: undefined });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		const validationErrors = validate(values);
		setErrors(validationErrors);
		if (Object.keys(validationErrors).length > 0) return;

		setLoading(true);
		try {
			const data = await signupUser(values);
			if (data.token) {
				localStorage.setItem("token", data.token);
				await refreshUser();
				router.push("/");
			} else {
				setError("Signup failed");
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
					disabled={loading}
					error={errors.email}
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
					disabled={loading}
					error={errors.password}
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
					disabled={loading}
					error={errors.passwordConfirm}
				/>
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
			</div>
			<Button type="submit" fullWidth loading={loading}>
				Submit
			</Button>
			{error && (
				<div className="bg-red-100 text-red-700 px-4 py-2 rounded mt-2 text-center">
					{error}
				</div>
			)}
		</form>
	);
}
