"use client";

import Link from "next/link";
import SignupForm from "./SignupForm";

export default function SignupPage() {
	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-center text-3xl font-bold">
				Sign up for <span className="text-blue-600">Survey Master</span>
			</h1>

			<SignupForm />

			<p className="text-center text-sm">
				Already have an account?{" "}
				<Link href="/login" className="text-blue-600 underline">
					Log in
				</Link>
			</p>
		</div>
	);
}
