"use client";

import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
	Legend,
} from "recharts";
import { Inbox } from "lucide-react";

export default function SurveyStatistics({
	hasResponses,
	chartData,
}: {
	hasResponses: boolean;
	chartData: { name: string; count: number }[];
}) {
	return (
		<section>
			<div className="bg-white border p-4 mb-8">
				{hasResponses ? (
					<>
						<div className="mb-4 font-semibold">Results Overview</div>
						<ResponsiveContainer width="100%" height={220}>
							<BarChart data={chartData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis allowDecimals={false} />
								<Tooltip />
								<Legend />
								<Bar dataKey="count" fill="#2563eb" />
							</BarChart>
						</ResponsiveContainer>
						<div className="mt-2 text-sm text-gray-600">
							Total responses: {chartData.reduce((a, b) => a + b.count, 0)}
						</div>
					</>
				) : (
					<div className="flex flex-col items-center justify-center py-12 text-gray-400">
						<Inbox size={48} strokeWidth={1.5} />
						<div className="mt-4 text-lg">No responses yet</div>
						<div className="text-sm">
							Results will appear here once users respond.
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
