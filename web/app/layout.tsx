"use client";

import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider, useUser } from "./_context/UserContext";
import React from "react";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

function AppLayout({ children }: { children: React.ReactNode }) {
	const { user, loading } = useUser();

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				Loading...
			</div>
		);
	}

	return (
		<>
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
							{loading ? null : user ? (
								<>
									<Link href="/" className="text-gray-700 hover:text-blue-600">
										Dashboard
									</Link>
									<Link
										href="/surveys"
										className="text-gray-700 hover:text-blue-600"
									>
										Surveys
									</Link>
									<Link
										href="/surveys/new"
										className="text-gray-700 hover:text-blue-600"
									>
										Create Survey
									</Link>
									<Link
										href="/logout"
										className="text-gray-700 hover:text-blue-600"
									>
										Logout
									</Link>
								</>
							) : (
								<>
									<Link
										href="/login"
										className="text-gray-700 hover:text-blue-600"
									>
										Login
									</Link>
									<Link
										href="/signup"
										className="text-gray-700 hover:text-blue-600"
									>
										Sign up
									</Link>
								</>
							)}
						</nav>
					</div>
				</div>
			</header>
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
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
			>
				<UserProvider>
					<AppLayout>{children}</AppLayout>
				</UserProvider>
			</body>
		</html>
	);
}
