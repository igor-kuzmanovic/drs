import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { HomePage } from '../components/HomePage';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { NotFoundPage } from '../components/NotFoundPage';
import { AuthLayout } from '../components/AuthLayout';
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
		element: <AuthLayout />,
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
						path: '/register',
						element: <RegisterPage />,
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
