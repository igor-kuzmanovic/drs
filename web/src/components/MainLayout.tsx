import surveyMasterLogo from '../assets/survey-master-logo.svg';
import {AppShell, Burger, Group, Image, NavLink, Skeleton} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router-dom';
import {Link} from "./Link";

export const MainLayout = () => {
	const [opened, { toggle }] = useDisclosure();

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
			padding="md"
		>
			<AppShell.Header>
				<Group h="100%" px="md">
					<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
					<Image src={surveyMasterLogo} alt="Survey Master" width={2440} height={640} w="auto" h="48" />
				</Group>
			</AppShell.Header>
			<AppShell.Navbar p="md">
				Navbar
				{Array(15)
					.fill(0)
					.map((_, index) => (
						<Skeleton key={index} h={28} mt="sm" animate={false} />
					))}
				<NavLink
					component={Link}
					to="/logout"
					label="Logout"
				/>
			</AppShell.Navbar>
			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
};
