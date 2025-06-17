import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { Loader } from "lucide-react";
import { useHealth } from "../_context/HealthContext";
import { SERVICE_TYPES, ServiceType } from "../_lib/health";

type CommonProps = {
	children: React.ReactNode;
	variant?: "primary" | "secondary" | "danger";
	size?: "sm" | "md" | "lg";
	fullWidth?: boolean;
	loading?: boolean;
	className?: string;
	requiredService?: ServiceType;
	disabledMessage?: string;
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
		requiredService,
		disabledMessage = "This service is currently unavailable",
		...rest
	} = props;

	const { isUserServiceHealthy, isSurveyServiceHealthy } = useHealth();

	const isServiceDown =
		requiredService &&
		((requiredService === SERVICE_TYPES.USER && !isUserServiceHealthy) ||
			(requiredService === SERVICE_TYPES.SURVEY && !isSurveyServiceHealthy));

	const sizeClasses = getSizeClasses(size);

	const isDisabled =
		"href" in props && props.href
			? loading || isServiceDown
			: !!(props as ActionAsButton).disabled || loading || isServiceDown;

	const tooltipMessage = isServiceDown
		? disabledMessage
		: isDisabled && (props as ActionAsButton).title
			? (props as ActionAsButton).title
			: undefined;

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
				title={tooltipMessage}
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
			title={tooltipMessage}
			{...buttonProps}
		>
			{loading && spinner}
			{children}
		</button>
	);
}
