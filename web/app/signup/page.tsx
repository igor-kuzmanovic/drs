"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../_context/UserContext";
import { useHealth } from "../_context/HealthContext";
import Link from "next/link";
import SignupForm from "./SignupForm";
import Loading from "../_components/Loading";
import ServiceUnavailable from "../_components/ServiceUnavailable";
import { SERVICE_TYPES } from "../_lib/health";

export default function Page() {
	const { user, loading, refreshUser } = useUser();
	const { isUserServiceHealthy } = useHealth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && user) {
			router.replace("/");
		}
	}, [user, loading, router]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loading />
			</div>
		);
	}

	if (user) return null;

	const handleSignupSuccess = () => {
		router.push("/");
	};

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-center text-3xl font-bold">
				Sign up for <span className="text-blue-600">Survey Master</span>
			</h1>

			<ServiceUnavailable
				serviceName={SERVICE_TYPES.USER}
				message="The signup service is currently unavailable. Please try again later."
			/>

			<SignupForm
				onUserUpdated={refreshUser}
				onSuccess={handleSignupSuccess}
				disabled={!isUserServiceHealthy}
			/>
			<p className="text-center text-sm">
				Already have an account?{" "}
				{isUserServiceHealthy ? (
					<Link href="/login" className="text-blue-600 underline">
						Log in
					</Link>
				) : (
					<span
						className="text-gray-400 cursor-not-allowed"
						title="Login is currently unavailable"
					>
						Log in
					</span>
				)}
			</p>
		</div>
	);
}
