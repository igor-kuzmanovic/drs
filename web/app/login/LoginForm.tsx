"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { printError } from "../_lib/error";
import { useUser } from "../_context/UserContext";
import Input from "../_components/Input";
import Action from "../_components/Action";
import { loginUser } from "../_lib/api";
import Alert from "../_components/Alert";

export default function LoginForm() {
	const router = useRouter();
	const { refreshUser } = useUser();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!email) {
			setError("Invalid email");
			return;
		}
		if (!password) {
			setError("Invalid password");
			return;
		}

		setLoading(true);
		try {
			const data = await loginUser({ email, password });
			if (data.token) {
				localStorage.setItem("token", data.token);
				await refreshUser();
				router.push("/");
			} else {
				setError("Login failed");
			}
		} catch (err) {
			setError(printError(err));
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			className="flex flex-col gap-6 w-full max-w-md mx-auto"
			onSubmit={handleSubmit}
		>
			<div className="flex flex-col gap-4">
				<Input
					id="email"
					label="Email"
					type="email"
					autoComplete="email"
					placeholder="john.doe@email.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={loading}
				/>
				<Input
					id="password"
					label="Password"
					type="password"
					autoComplete="current-password"
					placeholder="p@ssw0rd"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					disabled={loading}
				/>
			</div>
			<Action type="submit" fullWidth loading={loading}>
				Submit
			</Action>
			{error && <Alert type="error">{error}</Alert>}
		</form>
	);
}
