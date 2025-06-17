"use client";

import Link from "next/link";
import {
	X as CloseIcon,
	LayoutDashboard,
	PlusCircle,
	User as UserIcon,
} from "lucide-react";
import { useUser } from "../_context/UserContext";
import { useHealth } from "../_context/HealthContext";
import React from "react";
import { usePathname } from "next/navigation";
import { SERVICE_TYPES, ServiceType } from "../_lib/health";

function NavLink({
	href,
	children,
	icon,
	onClick,
	active,
	requiredService,
	disabledMessage,
}: {
	href: string;
	children: React.ReactNode;
	icon?: React.ReactNode;
	onClick?: () => void;
	active?: boolean;
	requiredService?: ServiceType;
	disabledMessage?: string;
}) {
	const { isUserServiceHealthy, isSurveyServiceHealthy } = useHealth();

	const isDisabled =
		requiredService &&
		((requiredService === SERVICE_TYPES.USER && !isUserServiceHealthy) ||
			(requiredService === SERVICE_TYPES.SURVEY && !isSurveyServiceHealthy));

	const baseClasses = `flex items-center gap-2 px-4 py-2 ${
		active
			? "bg-blue-600 text-white font-semibold"
			: "hover:bg-blue-50 text-gray-700 hover:text-blue-600"
	}`;

	const disabledClasses = "opacity-50 cursor-not-allowed pointer-events-none";

	const className = `${baseClasses} ${isDisabled ? disabledClasses : ""}`;

	return (
		<Link
			href={isDisabled ? "#" : href}
			className={className}
			onClick={(e) => {
				if (isDisabled) {
					e.preventDefault();
					return;
				}
				onClick?.();
			}}
			title={isDisabled ? disabledMessage : undefined}
			aria-disabled={isDisabled}
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
				requiredService={SERVICE_TYPES.USER}
				disabledMessage="Profile editing is currently unavailable"
			>
				Profile
			</NavLink>
			<NavLink
				href="/surveys/new"
				icon={<PlusCircle size={18} />}
				onClick={onNavigate}
				active={pathname === "/surveys/new"}
				requiredService={SERVICE_TYPES.SURVEY}
				disabledMessage="Survey creation is currently unavailable"
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
