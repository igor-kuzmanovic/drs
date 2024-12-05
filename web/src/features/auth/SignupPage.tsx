import classes from './SignupPage.module.css';
import { Stack, Text, Title } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { Link } from '../../components/Link';
import { SignupForm } from './SignupForm';

export const SignupPage = () => {
	useDocumentTitle('Sign up | SurveyMaster');

	return (
		<Stack>
			<Title className={classes.formTitle} order={1} size="h3">
				Sign up for <span className={classes.formTitleHighlight}>Survey Master</span>
			</Title>

			<SignupForm />

			<Text className={classes.alternateActionText} size="sm">
				Already have an account? <Link to="/login">Log in</Link>
			</Text>
		</Stack>
	);
};
