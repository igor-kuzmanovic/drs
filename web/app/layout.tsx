"use client";

import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider, useUser } from "./UserContext";
import { useState } from "react";

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
	const [sidebarOpen, setSidebarOpen] = useState(false);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				Loading...
			</div>
		);
	}

	return (
		<>
			<header className="sticky top-0 z-30 bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<button
						className="sm:hidden p-2 rounded hover:bg-gray-100"
						onClick={() => setSidebarOpen((v) => !v)}
						aria-label="Toggle sidebar"
					>
						<svg
							width="24"
							height="24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
					<Link
						href="/"
						className="flex items-center gap-2 text-xl font-bold text-blue-600"
					>
						<Image
							src="/survey-master-logo.svg"
							alt="Survey Master"
							width={32}
							height={32}
							className="h-8 w-auto"
							priority
						/>
						<span>Survey Master</span>
					</Link>
				</div>
				<nav className="hidden sm:flex items-center gap-6">
					{loading ? null : user ? (
						<>
							<Link
								href="/"
								className="text-gray-700 hover:text-blue-600 transition"
							>
								Dashboard
							</Link>
							<Link
								href="/logout"
								className="text-gray-700 hover:text-blue-600 transition"
							>
								Logout
							</Link>
						</>
					) : (
						<>
							<Link
								href="/login"
								className="text-gray-700 hover:text-blue-600 transition"
							>
								Login
							</Link>
							<Link
								href="/signup"
								className="text-gray-700 hover:text-blue-600 transition"
							>
								Sign up
							</Link>
						</>
					)}
				</nav>
			</header>
			{/* Sidebar for authenticated users */}
			{user && (
				<aside
					className={`fixed inset-y-0 left-0 z-20 w-64 bg-white border-r shadow-lg transform transition-transform duration-200 ease-in-out
                        ${
													sidebarOpen ? "translate-x-0" : "-translate-x-full"
												} sm:translate-x-0 sm:static sm:shadow-none`}
				>
					<div className="h-16 flex items-center px-6 border-b">
						<span className="font-semibold text-lg text-blue-600">Menu</span>
						<button
							className="ml-auto sm:hidden p-2 rounded hover:bg-gray-100"
							onClick={() => setSidebarOpen(false)}
							aria-label="Close sidebar"
						>
							<svg
								width="20"
								height="20"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M6 6l8 8M6 14L14 6" />
							</svg>
						</button>
					</div>
					<nav className="flex flex-col gap-2 p-4">
						<Link
							href="/"
							className="block px-3 py-2 rounded hover:bg-blue-50 text-gray-700 font-medium"
						>
							Home
						</Link>
						{/* Add more sidebar links here */}
						<Link
							href="/logout"
							className="block px-3 py-2 rounded hover:bg-blue-50 text-gray-700 font-medium"
						>
							Logout
						</Link>
					</nav>
				</aside>
			)}
			{/* Overlay for mobile sidebar */}
			{user && sidebarOpen && (
				<div
					className="fixed inset-0 z-10 bg-black/30 sm:hidden"
					onClick={() => setSidebarOpen(false)}
					aria-hidden="true"
				/>
			)}
			<main
				className={`transition-all duration-200 ${
					user ? "sm:ml-64" : ""
				} max-w-3xl mx-auto py-8 px-4`}
			>
				{children}
			</main>
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
