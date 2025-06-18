"use client";

import React from "react";
import clsx from "clsx";

type AlertProps = {
	type?: "success" | "error" | "info";
	children: React.ReactNode;
	className?: string;
};

export default function Alert({
	type = "info",
	children,
	className = "",
}: AlertProps) {
	const base = "px-4 py-2 text-center mt-2";
	const color =
		type === "success"
			? "bg-green-100 text-green-700"
			: type === "error"
				? "bg-red-100 text-red-700"
				: "bg-blue-100 text-blue-700";
	return <div className={clsx(base, color, className)}>{children}</div>;
}
