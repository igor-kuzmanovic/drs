import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
}

export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	className = "",
}: PaginationProps) {
	if (totalPages <= 1) return null;

	const handlePrevious = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
		}
	};

	const getPageNumbers = () => {
		const pages = [];
		const maxPagesToShow = 5;

		if (totalPages <= maxPagesToShow) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			const showLeftDots = currentPage > 3;
			const showRightDots = currentPage < totalPages - 2;

			if (showLeftDots && showRightDots) {
				pages.push(1);
				pages.push("...");
				pages.push(currentPage - 1);
				pages.push(currentPage);
				pages.push(currentPage + 1);
				pages.push("...");
				pages.push(totalPages);
			} else if (showLeftDots) {
				pages.push(1);
				pages.push("...");
				pages.push(totalPages - 3);
				pages.push(totalPages - 2);
				pages.push(totalPages - 1);
				pages.push(totalPages);
			} else {
				pages.push(1);
				pages.push(2);
				pages.push(3);
				pages.push(4);
				pages.push("...");
				pages.push(totalPages);
			}
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	return (
		<div
			className={clsx("flex items-center justify-center space-x-2", className)}
		>
			<button
				onClick={handlePrevious}
				disabled={currentPage === 1}
				className="p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
				aria-label="Previous page"
			>
				<ChevronLeft size={18} />
			</button>

			{pageNumbers.map((page, index) => (
				<React.Fragment key={index}>
					{page === "..." ? (
						<span className="px-3 py-1">...</span>
					) : (
						<button
							onClick={() => typeof page === "number" && onPageChange(page)}
							className={clsx(
								"px-3 py-1 rounded",
								currentPage === page
									? "bg-blue-600 text-white"
									: "hover:bg-gray-100",
							)}
							aria-current={currentPage === page ? "page" : undefined}
						>
							{page}
						</button>
					)}
				</React.Fragment>
			))}

			<button
				onClick={handleNext}
				disabled={currentPage === totalPages}
				className="p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
				aria-label="Next page"
			>
				<ChevronRight size={18} />
			</button>
		</div>
	);
}
