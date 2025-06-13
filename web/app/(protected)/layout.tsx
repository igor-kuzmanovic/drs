"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../_context/UserContext";
import Loading from "../_components/Loading";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, loading } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			router.replace("/login");
		}
	}, [user, loading, router]);

	if (loading || !user) return <Loading />;

	return <>{children}</>;
}
