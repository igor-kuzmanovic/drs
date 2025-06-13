"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../_context/UserContext";
import Link from "next/link";
import LoginForm from "./LoginForm";
import Loading from "../_components/Loading";

export default function Page() {
	const { user, loading } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (!loading && user) {
			router.replace("/");
		}
	}, [user, loading, router]);

	if (loading) return <Loading />;
	if (user) return null;

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
			</div>
		</div>
	);
}
