/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useDispatch, useSelector } from 'react-redux';
import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../features/auth/authSlice';
import { api } from './api';

const rootReducer = combineSlices({
	[api.reducerPath]: api.reducer,
	auth: authReducer,
});

const createStore = () => {
	return configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
		devTools: true,
	});
};

export const store = createStore();

export type RootState = ReturnType<typeof rootReducer>;

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
