import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { HomePage } from '../components/HomePage';
import { LoginPage } from '../features/auth/LoginPage';
import { SignupPage } from '../features/auth/SignupPage';
import { NotFoundPage } from '../components/NotFoundPage';
import { GuestLayout } from '../components/GuestLayout';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';
import { GuestRoute } from '../features/auth/GuestRoute';
import { LogoutPage } from '../features/auth/LogoutPage';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{
				path: '/',
				element: <ProtectedRoute />,
				children: [
					{
						path: '/',
						element: <HomePage />,
					},
					{
						path: '/logout',
						element: <LogoutPage />,
					},
				],
			},
		],
	},
	{
		path: '/',
		element: <GuestLayout />,
		children: [
			{
				path: '/',
				element: <GuestRoute />,
				children: [
					{
						path: '/login',
						element: <LoginPage />,
					},
					{
						path: '/signup',
						element: <SignupPage />,
					},
				],
			},
		],
	},
	{
		path: '*',
		element: <NotFoundPage />,
	},
]);
