"use client";

import { useUser } from "./UserContext";

export default function Home() {
	const { user, loading, error } = useUser();

	if (loading) return <div>Loading...</div>;
	if (error) return <div className="text-red-600">{error}</div>;
	if (!user) return null;

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold">
				Welcome, {user.firstName} {user.lastName}
			</h1>
		</div>
	);
}
