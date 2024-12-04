import { useDocumentTitle } from '@mantine/hooks';

export const NotFoundPage = () => {
	useDocumentTitle('404 Page Not Found | SurveyMaster');

	return (
		<>
			<h1>404 Page Not Found</h1>
		</>
	);
};
