import { useDocumentTitle } from '@mantine/hooks';
import { useGetUserQuery } from '../features/user/userApiSlice';
import { isValidationError, mapValidationErrorToString } from '../app/helpers';

export const HomePage = () => {
	useDocumentTitle('Home | SurveyMaster');

	const { data, error, isLoading } = useGetUserQuery();

	const errorMessage = isValidationError(error) ? mapValidationErrorToString(error) : String(error);

	return (
		<>
			{error ? (
				<>{errorMessage}</>
			) : isLoading ? (
				<>Loading...</>
			) : data ? (
				<>
					<h1>Welcome, {data.email}</h1>
				</>
			) : null}
		</>
	);
};
