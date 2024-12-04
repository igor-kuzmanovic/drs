import { Outlet } from 'react-router-dom';
import { AppShell, AppShellFooter, AppShellHeader, AppShellMain } from '@mantine/core';

export const MainLayout = () => (
	<AppShell>
		<AppShellHeader/>
		<AppShellMain>
			<Outlet/>
		</AppShellMain>
		<AppShellFooter/>
	</AppShell>
);
