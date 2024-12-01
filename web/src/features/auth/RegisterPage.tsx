import { Center, Container, Stack, Title } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { RegisterForm } from './RegisterForm';
import classes from './RegisterPage.module.css';

export const RegisterPage = () => {
	useDocumentTitle('Register | SurveyMaster');

	return (
		<Center mih="100vh">
			<Stack mt="md" mb="md">
				<Title className={classes.pageTitle} order={1} size={'h4'}>
					SurveyMaster
				</Title>

				<Container className={classes.formContainer} size="sm" miw="420" mih="360" p="xl" bg="white">
					<Stack gap="xl">
						<Title className={classes.formTitle} order={2} size="h3">
							Register
						</Title>

						<RegisterForm />
					</Stack>
				</Container>
			</Stack>
		</Center>
	);
};
