"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X as CloseIcon, CheckCircle, AlertCircle, Info } from "lucide-react";
import { createPortal } from "react-dom";

export const TOAST_TYPES = {
	success: "success",
	error: "error",
	info: "info",
} as const;

type ToastType = (typeof TOAST_TYPES)[keyof typeof TOAST_TYPES];

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
			case TOAST_TYPES.success:
				return <CheckCircle className="text-green-500" size={20} />;
			case TOAST_TYPES.error:
				return <AlertCircle className="text-red-500" size={20} />;
			case TOAST_TYPES.info:
				return <Info className="text-blue-500" size={20} />;
		}
	};

	const getBgColor = () => {
		switch (type) {
			case TOAST_TYPES.success:
				return "bg-green-50 border-green-400";
			case TOAST_TYPES.error:
				return "bg-red-50 border-red-400";
			case TOAST_TYPES.info:
				return "bg-blue-50 border-blue-400";
		}
	};

	return (
		<div
			className={`p-4 border ${getBgColor()} flex items-center gap-3 animate-slideIn`}
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
