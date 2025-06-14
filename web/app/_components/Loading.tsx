import React from "react";
import { Loader } from "lucide-react";

export default function Loading() {
	return (
		<div className="flex items-center justify-center gap-2 py-8 text-lg text-gray-600">
			<Loader className="h-5 w-5 text-blue-600 animate-spin" />
			<span>Loading...</span>
		</div>
	);
}
