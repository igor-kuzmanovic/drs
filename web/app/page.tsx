"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./_context/UserContext";

export default function Page() {
	const { user, loading } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			router.replace("/login");
		}
	}, [user, loading, router]);

	if (loading) return <div>Loading...</div>;
	if (!user) return null; // Prevent flicker

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold">
				Welcome,{" "}
				<span className="text-blue-600">
					{user.firstName} {user.lastName}
				</span>
			</h1>
		</div>
	);
}
