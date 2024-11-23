import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { ProfilePage } from '../pages/ProfilePage';
import { RegisterPage } from '../pages/RegisterPage';
import { RespondSurveyPage } from '../pages/RespondSurveyPage';
import { SurveyPage } from '../pages/SurveyPage';
import { NotFoundPage } from '../pages/NotFoundPage';

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />,
	},
	{
		path: '/login',
		element: <LoginPage />,
	},
	{
		path: '/profile',
		element: <ProfilePage />,
	},
	{
		path: '/register',
		element: <RegisterPage />,
	},
	{
		path: '/respond-survey',
		element: <RespondSurveyPage />,
	},
	{
		path: '/survey',
		element: <SurveyPage />,
	},
	{
		path: '*',
		element: <NotFoundPage />,
	},
]);

export function Router() {
	return <RouterProvider router={router} />;
}
