"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import Alert from "../_components/Alert";

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

export default class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
		};
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return {
			hasError: true,
			error,
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error("Uncaught error:", error, errorInfo);
	}

	render(): ReactNode {
		if (this.state.hasError) {
			return (
				this.props.fallback || (
					<div className="p-6 max-w-md mx-auto mt-10">
						<Alert type="error">
							<h3 className="text-lg font-medium">Something went wrong</h3>
							<p className="mt-2 text-sm">
								{this.state.error?.message || "An unexpected error occurred."}
							</p>
							<button
								className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
								onClick={() => {
									this.setState({ hasError: false, error: null });
									window.location.reload();
								}}
							>
								Try again
							</button>
						</Alert>
					</div>
				)
			);
		}

		return this.props.children;
	}
}
