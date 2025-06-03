"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../UserContext";

export default function LogoutPage() {
	const router = useRouter();
	const { refreshUser } = useUser();

	useEffect(() => {
		localStorage.removeItem("token");
		refreshUser().then(() => {
			router.replace("/login");
		});
	}, [refreshUser, router]);

	return <div className="text-center mt-10 text-lg">Logging out...</div>;
}
