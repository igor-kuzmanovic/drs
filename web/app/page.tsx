"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./_context/UserContext";

export default function Page() {
	const { user, loading, error } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			router.replace("/login");
		}
	}, [user, loading, router]);

	if (loading) return <div>Loading...</div>;
	if (error) return <div className="text-red-600">{error}</div>;
	if (!user) return null; // Prevent flicker

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold">
				Welcome, {user.firstName} {user.lastName}
			</h1>
		</div>
	);
}
