"use client";

import ProfileForm from "./ProfileForm";
import { useUser } from "../../_context/UserContext";
import Loading from "../../_components/Loading";

export default function Page() {
	const { user, refreshUser } = useUser();

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
			<ProfileForm user={user} onUserUpdated={refreshUser} />
		</div>
	);
}
