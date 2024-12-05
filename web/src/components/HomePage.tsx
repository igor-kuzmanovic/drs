import { useDocumentTitle } from '@mantine/hooks';

export const HomePage = () => {
	useDocumentTitle('Home | SurveyMaster');

	return <h1>Home Page</h1>;
};
