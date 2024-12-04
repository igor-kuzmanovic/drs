import { Outlet } from 'react-router-dom';
import { AppShell, AppShellMain } from '@mantine/core';

export const AuthLayout = () => (
	<AppShell>
		<AppShellMain>
			<Outlet/>
		</AppShellMain>
	</AppShell>
);
