"use client";

import React from "react";
import Input from "../_components/Input";
import Action from "../_components/Action";
import Alert from "../_components/Alert";
import { useForm } from "../_hooks/useForm";
import { useToast } from "../_context/ToastContext";
import AuthService from "../_lib/auth";
import { SERVICE_TYPES } from "../_lib/health";

export default function LoginForm({
	onUserUpdated,
	onSuccess,
	disabled = false,
}: {
	onUserUpdated: () => Promise<void>;
	onSuccess: () => void;
	disabled?: boolean;
}) {
	const { showToast } = useToast();

	const {
		values,
		errors: formErrors,
		loading,
		error,
		handleChange,
		handleSubmit,
	} = useForm({
		initialValues: {
			email: "",
			password: "",
		},
		validate: (values) => {
			const errors: Record<string, string> = {};
			if (!values.email) errors.email = "Email is required";
			if (!values.password) errors.password = "Password is required";
			return errors;
		},
		onSubmit: async (values) => {
			await AuthService.login({
				email: values.email,
				password: values.password,
			});
			await onUserUpdated();
			showToast("Login successful", "success");
			onSuccess();
		},
	});

	return (
		<form
			className="flex flex-col gap-6 w-full max-w-md mx-auto"
			onSubmit={handleSubmit}
		>
			<div className="flex flex-col gap-4">
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
					autoComplete="current-password"
					placeholder="p@ssw0rd"
					value={values.password}
					onChange={handleChange}
					disabled={loading || disabled}
					error={formErrors.password}
				/>
			</div>
			<Action
				type="submit"
				fullWidth
				loading={loading}
				disabled={disabled}
				requiredService={disabled ? SERVICE_TYPES.USER : undefined}
				disabledMessage="Login is currently unavailable"
			>
				Log In
			</Action>
			{error && <Alert type="error">{error}</Alert>}
		</form>
	);
}
