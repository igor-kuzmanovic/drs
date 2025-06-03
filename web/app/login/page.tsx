"use client";

import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPage() {
	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-center text-3xl font-bold">
				Log in to <span className="text-blue-600">Survey Master</span>
			</h1>

			<LoginForm />

			<div className="flex flex-col gap-2">
				<p className="text-center text-sm">
					Don&apos;t have an account?{" "}
					<Link href="/signup" className="text-blue-600 underline">
						Sign up
					</Link>
				</p>
				<p className="text-center text-sm">
					<Link href="/" className="text-blue-600 underline">
						Forgot your password?
					</Link>
				</p>
			</div>
		</div>
	);
}
