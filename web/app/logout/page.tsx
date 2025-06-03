"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
	const router = useRouter();

	useEffect(() => {
		localStorage.removeItem("token");
		router.replace("/login");
	}, [router]);

	return <div className="text-center mt-10 text-lg">Logging out...</div>;
}
