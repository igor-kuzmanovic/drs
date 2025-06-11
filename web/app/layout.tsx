"use client";

import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider, useUser } from "./_context/UserContext";
import React from "react";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

function LoadingScreen() {
	return (
		<div className="flex justify-center items-center h-screen">Loading...</div>
	);
}

function NavLink({
	href,
	children,
}: {
	href: string;
	children: React.ReactNode;
}) {
	return (
		<Link href={href} className="text-gray-700 hover:text-blue-600">
			{children}
		</Link>
	);
}

function AuthLinks() {
	return (
		<>
			<NavLink href="/">Dashboard</NavLink>
			<NavLink href="/surveys">Surveys</NavLink>
			<NavLink href="/surveys/new">Create Survey</NavLink>
			<NavLink href="/profile">Profile</NavLink>
			<NavLink href="/logout">Logout</NavLink>
		</>
	);
}

function GuestLinks() {
	return (
		<>
			<NavLink href="/login">Login</NavLink>
			<NavLink href="/signup">Sign up</NavLink>
		</>
	);
}

function Navbar() {
	const { user, loading } = useUser();

	return (
		<header className="sticky top-0 z-30 bg-white border-b shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<Link
						href="/"
						className="flex items-center gap-2 text-xl font-bold text-blue-600"
					>
						<span>Survey Master</span>
					</Link>
					<nav className="flex items-center gap-6">
						{loading ? null : user ? <AuthLinks /> : <GuestLinks />}
					</nav>
				</div>
			</div>
		</header>
	);
}

function AppLayout({ children }: { children: React.ReactNode }) {
	const { loading } = useUser();

	if (loading) {
		return <LoadingScreen />;
	}

	return (
		<>
			<Navbar />
			<main className="max-w-3xl mx-auto py-8 px-4">{children}</main>
		</>
	);
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${inter.variable} antialiased bg-gray-50 min-h-screen`}>
				<UserProvider>
					<AppLayout>{children}</AppLayout>
				</UserProvider>
			</body>
		</html>
	);
}
