import { useDocumentTitle } from '@mantine/hooks';
import { useGetUserQuery } from '../features/user/userApiSlice';
import { selectUser } from '../features/user/userSlice';
import { mapErrorToString } from '../app/helpers';
import { useAppSelector } from '../app/store';

export const HomePage = () => {
	useDocumentTitle('Home | SurveyMaster');

	const { error, isLoading } = useGetUserQuery();

	const user = useAppSelector(selectUser);

	return (
		<>
			{error ? (
				<>{mapErrorToString(error)}</>
			) : isLoading ? (
				<>Loading...</>
			) : user ? (
				<>
					<h1>Welcome, {user.firstName} {user.lastName}</h1>
				</>
			) : null}
		</>
	);
};
