"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X as CloseIcon, CheckCircle, AlertCircle, Info } from "lucide-react";
import { createPortal } from "react-dom";

type ToastType = "success" | "error" | "info";

interface Toast {
	id: string;
	message: string;
	type: ToastType;
}

interface ToastContextValue {
	showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const showToast = useCallback(
		(message: string, type: ToastType) => {
			const id = Date.now().toString();
			setToasts((prev) => [...prev, { id, message, type }]);

			setTimeout(() => {
				removeToast(id);
			}, 5_000);
		},
		[removeToast],
	);

	// Only render the toast container if we're in the browser
	const [isMounted, setIsMounted] = useState(false);
	React.useEffect(() => {
		setIsMounted(true);
		return () => setIsMounted(false);
	}, []);

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			{isMounted &&
				createPortal(
					<div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col gap-2 max-w-md">
						{toasts.map((toast) => (
							<ToastItem
								key={toast.id}
								toast={toast}
								onClose={() => removeToast(toast.id)}
							/>
						))}
					</div>,
					document.body,
				)}
		</ToastContext.Provider>
	);
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({
	toast,
	onClose,
}) => {
	const { type, message } = toast;

	const getIcon = () => {
		switch (type) {
			case "success":
				return <CheckCircle className="text-green-500" size={20} />;
			case "error":
				return <AlertCircle className="text-red-500" size={20} />;
			case "info":
				return <Info className="text-blue-500" size={20} />;
		}
	};

	const getBgColor = () => {
		switch (type) {
			case "success":
				return "bg-green-50 border-green-200";
			case "error":
				return "bg-red-50 border-red-200";
			case "info":
				return "bg-blue-50 border-blue-200";
		}
	};

	return (
		<div
			className={`p-4 rounded-lg shadow-md border ${getBgColor()} flex items-start gap-3 animate-slideIn`}
			role="alert"
		>
			{getIcon()}
			<div className="flex-1">{message}</div>
			<button
				onClick={onClose}
				className="text-gray-500 hover:text-gray-700"
				aria-label="Close notification"
			>
				<CloseIcon size={16} />
			</button>
		</div>
	);
};
