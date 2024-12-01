import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../app/store';
import { selectIsAuthenticated } from './authSlice';

export const GuestRoute = () => {
	const isAuthenticated = useAppSelector(selectIsAuthenticated);

	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
};
