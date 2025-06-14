"use client";
import React from "react";
import {
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
} from "recharts";

const PIE_COLORS = ["#2563eb", "#dc2626", "#fbbf24"];

export function SurveyPieChart({
	chartData,
}: {
	chartData: { name: string; count: number }[];
}) {
	return (
		<section>
			<div className="bg-white border p-4 mb-8">
				<div className="mb-4 font-semibold">Results Overview</div>
				<ResponsiveContainer width="100%" height={220}>
					<PieChart>
						<Pie
							data={chartData}
							dataKey="count"
							nameKey="name"
							cx="50%"
							cy="50%"
							outerRadius={80}
							label
						>
							{chartData.map((entry, idx) => (
								<Cell
									key={`cell-${idx}`}
									fill={PIE_COLORS[idx % PIE_COLORS.length]}
								/>
							))}
						</Pie>
						<Tooltip />
						<Legend />
					</PieChart>
				</ResponsiveContainer>
				<div className="mt-2 text-sm text-gray-600">
					Total responses: {chartData.reduce((a, b) => a + b.count, 0)}
				</div>
			</div>
		</section>
	);
}
