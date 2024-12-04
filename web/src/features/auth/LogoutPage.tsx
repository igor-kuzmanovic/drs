import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/store';
import { logOut } from './authSlice';

export const LogoutPage = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(logOut());
		navigate('/login');
	}, [dispatch, navigate]);

	return null;
};
