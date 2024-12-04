import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../app/store';
import { selectIsAuthenticated } from './authSlice';

export const ProtectedRoute = () => {
	const isAuthenticated = useAppSelector(selectIsAuthenticated);

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
};
