"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { printError } from "@/lib/helpers";
import { useUser } from "../UserContext";

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
			const res = await fetch(`${process.env.NEXT_PUBLIC_USER_API_URL}/users`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});
			if (!res.ok) {
				const data = await res.json();
				setError(data.message || "Signup failed");
			} else {
				const data = await res.json();
				if (data.token) {
					localStorage.setItem("token", data.token);
					await refreshUser();
				}
				router.push("/");
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
				<div>
					<label className="block text-sm font-medium mb-1" htmlFor="email">
						Email
					</label>
					<input
						className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						placeholder="john.doe@email.com"
						value={values.email}
						onChange={handleChange}
						disabled={loading}
					/>
					{errors.email && (
						<div className="text-red-600 text-xs mt-1">{errors.email}</div>
					)}
				</div>
				<div>
					<label className="block text-sm font-medium mb-1" htmlFor="password">
						Password
					</label>
					<input
						className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						id="password"
						name="password"
						type="password"
						autoComplete="new-password"
						placeholder="p@ssw0rd"
						value={values.password}
						onChange={handleChange}
						disabled={loading}
					/>
					{errors.password && (
						<div className="text-red-600 text-xs mt-1">{errors.password}</div>
					)}
				</div>
				<div>
					<label
						className="block text-sm font-medium mb-1"
						htmlFor="passwordConfirm"
					>
						Password confirm
					</label>
					<input
						className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						id="passwordConfirm"
						name="passwordConfirm"
						type="password"
						autoComplete="new-password"
						placeholder="p@ssw0rd"
						value={values.passwordConfirm}
						onChange={handleChange}
						disabled={loading}
					/>
					{errors.passwordConfirm && (
						<div className="text-red-600 text-xs mt-1">
							{errors.passwordConfirm}
						</div>
					)}
				</div>
				<div>
					<label className="block text-sm font-medium mb-1" htmlFor="firstName">
						First name
					</label>
					<input
						className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						id="firstName"
						name="firstName"
						autoComplete="given-name"
						placeholder="John"
						value={values.firstName}
						onChange={handleChange}
						disabled={loading}
					/>
					{errors.firstName && (
						<div className="text-red-600 text-xs mt-1">{errors.firstName}</div>
					)}
				</div>
				<div>
					<label className="block text-sm font-medium mb-1" htmlFor="lastName">
						Last name
					</label>
					<input
						className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						id="lastName"
						name="lastName"
						autoComplete="family-name"
						placeholder="Doe"
						value={values.lastName}
						onChange={handleChange}
						disabled={loading}
					/>
					{errors.lastName && (
						<div className="text-red-600 text-xs mt-1">{errors.lastName}</div>
					)}
				</div>
				<div>
					<label className="block text-sm font-medium mb-1" htmlFor="address">
						Address
					</label>
					<input
						className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						id="address"
						name="address"
						autoComplete="street-address"
						placeholder="221B Baker Street"
						value={values.address}
						onChange={handleChange}
						disabled={loading}
					/>
					{errors.address && (
						<div className="text-red-600 text-xs mt-1">{errors.address}</div>
					)}
				</div>
				<div>
					<label className="block text-sm font-medium mb-1" htmlFor="city">
						City
					</label>
					<input
						className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						id="city"
						name="city"
						autoComplete="address-level-2"
						placeholder="London"
						value={values.city}
						onChange={handleChange}
						disabled={loading}
					/>
					{errors.city && (
						<div className="text-red-600 text-xs mt-1">{errors.city}</div>
					)}
				</div>
				<div>
					<label className="block text-sm font-medium mb-1" htmlFor="country">
						Country
					</label>
					<input
						className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						id="country"
						name="country"
						autoComplete="country-name"
						placeholder="United Kingdom"
						value={values.country}
						onChange={handleChange}
						disabled={loading}
					/>
					{errors.country && (
						<div className="text-red-600 text-xs mt-1">{errors.country}</div>
					)}
				</div>
				<div>
					<label className="block text-sm font-medium mb-1" htmlFor="phone">
						Phone
					</label>
					<input
						className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						id="phone"
						name="phone"
						autoComplete="tel"
						placeholder="+1 (123) 456-7890"
						value={values.phone}
						onChange={handleChange}
						disabled={loading}
					/>
					{errors.phone && (
						<div className="text-red-600 text-xs mt-1">{errors.phone}</div>
					)}
				</div>
			</div>
			<button
				type="submit"
				className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 mt-4"
				disabled={loading}
			>
				{loading ? "Signing up..." : "Submit"}
			</button>
			{error && (
				<div className="bg-red-100 text-red-700 px-4 py-2 rounded mt-2 text-center">
					{error}
				</div>
			)}
		</form>
	);
}
