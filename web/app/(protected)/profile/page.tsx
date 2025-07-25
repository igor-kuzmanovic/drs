"use client";

import ProfileForm from "./ProfileForm";
import { useUser } from "../../_context/UserContext";
import { useHealth } from "../../_context/HealthContext";
import Loading from "../../_components/Loading";
import ServiceUnavailable from "../../_components/ServiceUnavailable";
import { SERVICE_TYPES } from "../../_lib/health";

export default function Page() {
	const { user, refreshUser } = useUser();
	const { isUserServiceHealthy } = useHealth();

	if (!user) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loading />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-center text-3xl font-bold">
				Edit your <span className="text-blue-600">Profile</span>
			</h1>

			<ServiceUnavailable
				serviceName={SERVICE_TYPES.USER}
				message="Profile editing is currently unavailable. Please try again later."
			/>

			<ProfileForm
				user={user}
				onUserUpdated={refreshUser}
				disabled={!isUserServiceHealthy}
			/>
		</div>
	);
}
