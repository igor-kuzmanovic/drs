"use client";
import React from "react";
import {
	ResponsiveContainer,
	LineChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	Line,
} from "recharts";

export function SurveyDailyChart({
	dailyCounts,
}: {
	dailyCounts: { date: string; count: number }[];
}) {
	return (
		<section>
			<div className="bg-white border p-4 mb-8">
				<div className="mb-4 font-semibold">Answers Per Day</div>
				<ResponsiveContainer width="100%" height={220}>
					<LineChart data={dailyCounts}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="date" />
						<YAxis allowDecimals={false} />
						<Tooltip />
						<Legend formatter={() => null} payload={[]} />
						<Line
							type="monotone"
							dataKey="count"
							name="Responses"
							stroke="#16a34a"
							dot={false}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</section>
	);
}
