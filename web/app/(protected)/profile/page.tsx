"use client";

import ProfileForm from "./ProfileForm";

export default function Page() {
	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-center text-3xl font-bold">
				Edit your <span className="text-blue-600">Profile</span>
			</h1>
			<ProfileForm />
		</div>
	);
}
