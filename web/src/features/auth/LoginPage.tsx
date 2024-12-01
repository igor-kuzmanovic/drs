import { Center, Container, Stack, Title } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { LoginForm } from './LoginForm';
import classes from './LoginPage.module.css';

export const LoginPage = () => {
	useDocumentTitle('Login | SurveyMaster');

	return (
		<Center mih="100vh" >
			<Stack mt="md" mb="md">
				<Title className={classes.pageTitle} order={1} size={'h4'}>
					SurveyMaster
				</Title>

				<Container className={classes.formContainer} size="sm" miw="420" mih="360" p="xl" bg="white">
					<Stack gap="xl">
						<Title className={classes.formTitle} order={2} size="h3">
							Login
						</Title>

						<LoginForm />
					</Stack>
				</Container>
			</Stack>
		</Center>
	);
};
