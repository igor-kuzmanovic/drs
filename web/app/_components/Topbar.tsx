"use client";

import Link from "next/link";
import {
	LogIn,
	UserPlus,
	LogOut,
	Menu as MenuIcon,
	ClipboardList,
} from "lucide-react";
import { useUser } from "../_context/UserContext";
import { usePathname } from "next/navigation";

function NavLink({
	href,
	children,
}: {
	href: string;
	children: React.ReactNode;
}) {
	return (
		<Link
			href={href}
			className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600"
		>
			{children}
		</Link>
	);
}

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
	const { user, loading } = useUser();
	const pathname = usePathname();

	return (
		<header className="sticky top-0 z-30 bg-white border-b h-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center gap-2 min-w-0">
						<button
							className="md:hidden mr-2"
							onClick={onMenuClick}
							aria-label="Open sidebar"
						>
							<MenuIcon className="w-6 h-6" />
						</button>
						<Link href="/" className="flex items-center gap-2 truncate min-w-0">
							<ClipboardList className="w-7 h-7 flex-shrink-0 text-blue-600" />
							<span className="flex flex-col leading-tight min-w-0 -mt-1">
								<span className="text-base sm:text-lg truncate font-bold text-blue-600">
									Survey
								</span>
								<span className="text-xs sm:text-sm font-bold truncate text-gray-700 -mt-1">
									Master
								</span>
							</span>
						</Link>
					</div>
					<nav className="flex items-center gap-6">
						{loading
							? null
							: !user && (
									<>
										{pathname !== "/login" && (
											<NavLink href="/login">
												<LogIn size={18} />
												<span className="leading-none">Log in</span>
											</NavLink>
										)}
										{pathname === "/login" && (
											<NavLink href="/signup">
												<UserPlus size={18} />
												<span className="leading-none">Sign up</span>
											</NavLink>
										)}
									</>
								)}
						{user && (
							<NavLink href="/logout">
								<LogOut size={18} />
								<span className="leading-none">Logout</span>
							</NavLink>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
}
