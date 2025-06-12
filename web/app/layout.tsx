"use client";

import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider, useUser } from "./_context/UserContext";
import React, { useState } from "react";
import Sidebar from "./_components/Sidebar";
import Topbar from "./_components/Topbar";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

function LoadingScreen() {
	return (
		<div className="flex justify-center items-center h-screen">Loading...</div>
	);
}

function AppLayout({ children }: { children: React.ReactNode }) {
	const { loading, user } = useUser();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	if (loading) {
		return <LoadingScreen />;
	}

	const showSidebar = !!user;

	return (
		<div className="flex flex-col min-h-screen">
			<Topbar onMenuClick={() => setSidebarOpen(true)} />
			<div className="flex flex-1">
				{/* Sidebar: only visible for authenticated users */}
				{showSidebar && (
					<div className="md:block">
						<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
					</div>
				)}
				<main className="flex-1 max-w-3xl mx-auto py-8 px-4">{children}</main>
			</div>
		</div>
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
