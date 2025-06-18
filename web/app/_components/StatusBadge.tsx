"use client";

import clsx from "clsx";
import { SurveyStatusType, SURVEY_STATUS } from "../_lib/models";

export function StatusBadge({ status }: { status: SurveyStatusType }) {
	const color = (() => {
		switch (status) {
			case SURVEY_STATUS.ACTIVE:
				return "bg-green-100 text-green-800 border-green-300";
			case SURVEY_STATUS.CLOSED:
				return "bg-gray-100 text-gray-700 border-gray-300";
			default:
				return "bg-gray-100 text-gray-700 border-gray-300";
		}
	})();
	const label = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
	return (
		<span
			className={clsx(
				"inline-block px-2 py-0.5 text-xs font-semibold border",
				color,
			)}
		>
			{label}
		</span>
	);
}
