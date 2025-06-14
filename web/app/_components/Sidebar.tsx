"use client";

import Link from "next/link";
import {
	X as CloseIcon,
	LayoutDashboard,
	PlusCircle,
	User as UserIcon,
} from "lucide-react";
import { useUser } from "../_context/UserContext";
import React from "react";
import { usePathname } from "next/navigation";

function NavLink({
	href,
	children,
	icon,
	onClick,
	active,
}: {
	href: string;
	children: React.ReactNode;
	icon?: React.ReactNode;
	onClick?: () => void;
	active?: boolean;
}) {
	return (
		<Link
			href={href}
			className={`flex items-center gap-2 px-4 py-2
                ${
									active
										? "bg-blue-600 text-white font-semibold"
										: "hover:bg-blue-50 text-gray-700 hover:text-blue-600"
								}
            `}
			onClick={onClick}
		>
			{icon}
			<span className="truncate">{children}</span>
		</Link>
	);
}

function AuthSidebarLinks({
	onNavigate,
	pathname,
}: {
	onNavigate?: () => void;
	pathname: string;
}) {
	return (
		<>
			<NavLink
				href="/"
				icon={<LayoutDashboard size={18} />}
				onClick={onNavigate}
				active={
					pathname === "/" ||
					(pathname !== "/surveys/new" && pathname.startsWith("/surveys/"))
				}
			>
				Dashboard
			</NavLink>
			<NavLink
				href="/profile"
				icon={<UserIcon size={18} />}
				onClick={onNavigate}
				active={pathname === "/profile"}
			>
				Profile
			</NavLink>
			<NavLink
				href="/surveys/new"
				icon={<PlusCircle size={18} />}
				onClick={onNavigate}
				active={pathname === "/surveys/new"}
			>
				Create Survey
			</NavLink>
		</>
	);
}

export default function Sidebar({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const { user, loading } = useUser();
	const pathname = usePathname();

	return (
		<>
			{/* Overlay for mobile */}
			{open && (
				<div
					className="fixed inset-0 bg-black/30 z-40 md:hidden"
					onClick={onClose}
				/>
			)}
			{/* Sidebar: fixed on mobile, static and below topbar on desktop */}
			<aside
				className={`
					fixed z-50 top-0 left-0 h-full w-64 bg-white transform
					${open ? "translate-x-0" : "-translate-x-full"}
					transition-transform duration-200
					md:translate-x-0
					md:top-[64px] md:h-[calc(100vh-64px)] md:w-56
					border-r border-solid
					${open ? "block" : "hidden"} md:block
					overflow-y-auto
				`}
			>
				{/* Mobile header */}
				<div className="h-16 flex items-center justify-end px-4 py-4 border-b md:hidden">
					<button onClick={onClose} aria-label="Close sidebar">
						<CloseIcon className="w-6 h-6" />
					</button>
				</div>
				{/* Desktop: add pt-4 to push below topbar */}
				<nav className="flex flex-col gap-1 mt-4 md:mt-0 md:pt-4">
					{!loading && user && (
						<AuthSidebarLinks onNavigate={onClose} pathname={pathname} />
					)}
				</nav>
			</aside>
		</>
	);
}
