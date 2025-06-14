import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { Loader } from "lucide-react";

type CommonProps = {
	children: React.ReactNode;
	variant?: "primary" | "secondary" | "danger";
	size?: "sm" | "md" | "lg";
	fullWidth?: boolean;
	loading?: boolean;
	className?: string;
};

type ActionAsButton = CommonProps &
	React.ButtonHTMLAttributes<HTMLButtonElement> & {
		href?: undefined;
	};

type ActionAsLink = CommonProps &
	React.AnchorHTMLAttributes<HTMLAnchorElement> & {
		href: string;
	};

type ActionProps = ActionAsButton | ActionAsLink;

function getSizeClasses(size: "sm" | "md" | "lg" = "md") {
	return size === "sm"
		? "px-3 py-1.5 text-sm"
		: size === "lg"
			? "px-6 py-3 text-lg"
			: "px-4 py-2 text-base";
}

export default function Action(props: ActionProps) {
	const {
		children,
		variant = "primary",
		size = "md",
		fullWidth = false,
		loading = false,
		className = "",
		...rest
	} = props;

	const sizeClasses = getSizeClasses(size);

	const isDisabled =
		"href" in props && props.href
			? loading // Only loading disables a link
			: !!(props as ActionAsButton).disabled || loading;

	const classes = clsx(
		"border flex items-center justify-center gap-2 font-medium transition-colors relative",
		sizeClasses,
		{
			"w-full": fullWidth,
			"bg-blue-600 text-white border-blue-600":
				variant === "primary" && !isDisabled,
			"hover:bg-blue-700": variant === "primary" && !isDisabled,
			"bg-white text-gray-700": variant === "secondary" && !isDisabled,
			"hover:bg-gray-100": variant === "secondary" && !isDisabled,
			"bg-red-600 text-white border-red-600":
				variant === "danger" && !isDisabled,
			"hover:bg-red-700": variant === "danger" && !isDisabled,
			"opacity-50 cursor-not-allowed": isDisabled,
			"cursor-pointer": !isDisabled,
		},
		className,
	);

	const spinner = (
		<Loader className="w-5 h-5 animate-spin mr-2" aria-label="Loading" />
	);

	if ("href" in props && props.href) {
		const { href, ...linkProps } = rest as ActionAsLink;
		return (
			<Link
				href={href}
				className={classes}
				tabIndex={isDisabled ? -1 : 0}
				aria-disabled={isDisabled}
				{...linkProps}
				onClick={(e) => {
					if (isDisabled) {
						e.preventDefault();
					}
					if (typeof linkProps.onClick === "function") {
						linkProps.onClick(e);
					}
				}}
			>
				{loading && spinner}
				{children}
			</Link>
		);
	}

	const buttonProps = rest as ActionAsButton;
	return (
		<button
			type={buttonProps.type || "button"}
			disabled={isDisabled}
			className={classes}
			{...buttonProps}
		>
			{loading && spinner}
			{children}
		</button>
	);
}
