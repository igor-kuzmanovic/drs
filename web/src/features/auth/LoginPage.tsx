import classes from './LoginPage.module.css';
import { Stack, Text, Title } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { Link } from '../../components/Link';
import { LoginForm } from './LoginForm';

export const LoginPage = () => {
	useDocumentTitle('Log in | SurveyMaster');

	return (
		<Stack gap="xl">
			<Title className={classes.formTitle} order={1} size="h3">
				Log in to <span className={classes.formTitleHighlight}>Survey Master</span>
			</Title>

			<LoginForm />

			<Stack gap="xs">
				<Text className={classes.alternateActionText} size="sm">
					Don't have an account? <Link to="/signup">Sign up</Link>
				</Text>

				<Text className={classes.alternateActionText} size="sm">
					<Link to="/">Forgot your password?</Link>
				</Text>
			</Stack>
		</Stack>
	);
};
