"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { printError } from "@/lib/helpers";
import { useUser } from "../UserContext";

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

		// Simple validation
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
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.message || "Login failed");
			} else {
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
			className="flex flex-col gap-6 w-full max-w-md mx-auto"
			onSubmit={handleSubmit}
		>
			<div className="flex flex-col gap-4">
				<div>
					<label htmlFor="email" className="block text-sm font-medium mb-1">
						Email
					</label>
					<input
						id="email"
						type="email"
						autoComplete="email"
						className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="john.doe@email.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={loading}
					/>
				</div>
				<div>
					<label htmlFor="password" className="block text-sm font-medium mb-1">
						Password
					</label>
					<input
						id="password"
						type="password"
						autoComplete="current-password"
						className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="p@ssw0rd"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						disabled={loading}
					/>
				</div>
			</div>
			<button
				type="submit"
				className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50"
				disabled={loading}
			>
				{loading ? "Logging in..." : "Submit"}
			</button>
			{error && (
				<div className="bg-red-100 text-red-700 px-4 py-2 rounded mt-2 text-center">
					{error}
				</div>
			)}
		</form>
	);
}
