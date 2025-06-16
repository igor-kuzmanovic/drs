"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../_context/UserContext";
import Link from "next/link";
import SignupForm from "./SignupForm";
import Loading from "../_components/Loading";

export default function Page() {
	const { user, loading, refreshUser } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (!loading && user) {
			router.replace("/");
		}
	}, [user, loading, router]);

	if (loading)
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loading />
			</div>
		);
	if (user) return null;

	const handleSignupSuccess = () => {
		router.push("/");
	};

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-center text-3xl font-bold">
				Sign up for <span className="text-blue-600">Survey Master</span>
			</h1>
			<SignupForm onUserUpdated={refreshUser} onSuccess={handleSignupSuccess} />
			<p className="text-center text-sm">
				Already have an account?{" "}
				<Link href="/login" className="text-blue-600 underline">
					Log in
				</Link>
			</p>
		</div>
	);
}
