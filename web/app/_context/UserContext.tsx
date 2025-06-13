"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUser, User } from "../_lib/api";

type UserContextType = {
	user: User | null;
	setUser: (user: User | null) => void;
	loading: boolean;
	error: string | null;
	refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
	const ctx = useContext(UserContext);
	if (!ctx) throw new Error("useUser must be used within a UserProvider");
	return ctx;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const refreshUser = async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			setUser(null);
			setLoading(false);
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const userData = await getUser();
			setUser(userData);
		} catch (err: any) {
			if (err.message?.toLowerCase().includes("401")) {
				localStorage.removeItem("token");
				setUser(null);
				setError("Session expired. Please log in again.");
				window.location.href = "/login";
			} else {
				setUser(null);
				setError("Failed to fetch user");
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refreshUser();
		const onStorage = () => refreshUser();
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

	return (
		<UserContext.Provider
			value={{ user, setUser, loading, error, refreshUser }}
		>
			{children}
		</UserContext.Provider>
	);
}
