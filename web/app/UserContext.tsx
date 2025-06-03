"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	address: string;
	city: string;
	country: string;
	phone: string;
	createdAt: string;
	updatedAt: string;
};

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
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!res.ok) {
				setUser(null);
				setError("Failed to fetch user");
			} else {
				const data = await res.json();
				setUser(data);
			}
		} catch {
			setUser(null);
			setError("Failed to fetch user");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refreshUser();
		// Listen for login/logout in other tabs
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
