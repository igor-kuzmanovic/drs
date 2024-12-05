import { Outlet } from 'react-router-dom';
import { AppShell, AppShellMain, Center, Container, Paper } from '@mantine/core';

export const GuestLayout = () => (
	<AppShell bg="var(--mantine-primary-color-1)">
		<AppShellMain>
			<Container size="sm">
				<Center mih="100vh">
					<Paper shadow="xl" radius="lg" p="xl" bg="white" miw="420" mih="360">
						<Outlet />
					</Paper>
				</Center>
			</Container>
		</AppShellMain>
	</AppShell>
);
