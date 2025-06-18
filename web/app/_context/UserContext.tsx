"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { User } from "../_lib/models";
import AuthService from "../_lib/auth";
import UserService from "../_lib/user";
import { TOAST_TYPES, useToast } from "./ToastContext";
import { useRouter } from "next/navigation";
import { printError } from "../_lib/error";

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
	const { showToast } = useToast();
	const router = useRouter();

	const refreshUser = useCallback(async () => {
		if (!AuthService.isAuthenticated()) {
			setUser(null);
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const userData = await UserService.getUser();
			setUser(userData);
		} catch (err) {
			if (
				err &&
				typeof err === "object" &&
				"status" in err &&
				err.status === 401
			) {
				AuthService.removeToken();
				setUser(null);
				showToast("Session expired. Please log in again.", TOAST_TYPES.ERROR);
				router.replace("/login");
			} else {
				setUser(null);
				const errorMessage = printError(err);
				setError(errorMessage);
				showToast(errorMessage, TOAST_TYPES.ERROR);
			}
		} finally {
			setLoading(false);
		}
	}, [setUser, setLoading, setError, showToast, router]);

	useEffect(() => {
		refreshUser();

		// Listen for storage events (token changes)
		const onStorage = () => refreshUser();
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, [refreshUser]);

	return (
		<UserContext.Provider
			value={{ user, setUser, loading, error, refreshUser }}
		>
			{children}
		</UserContext.Provider>
	);
}
