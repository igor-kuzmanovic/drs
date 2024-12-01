import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { authApiSlice } from './authApiSlice';

interface AuthState {
	token: string | null;
	isAuthenticated: boolean;
}

const initialState: AuthState = {
	// Get the token from local storage
	token: localStorage.getItem('token'),
	isAuthenticated: Boolean(localStorage.getItem('token')),
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCredentials: (state, action) => {
			state.token = action.payload.token;
			state.isAuthenticated = true;
			// Set the token to local storage
			localStorage.setItem('token', action.payload.token);
		},
		logOut: (state) => {
			state.token = null;
			state.isAuthenticated = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(authApiSlice.endpoints.login.matchPending, () => {
				// Noop
			})
			.addMatcher(authApiSlice.endpoints.login.matchFulfilled, (state, action) => {
				// TODO Figure out how to reuse setCredentials
				state.token = action.payload.token;
				state.isAuthenticated = true;
				// Set the token to local storage
				localStorage.setItem('token', action.payload.token);
			})
			.addMatcher(authApiSlice.endpoints.login.matchRejected, () => {
				// Noop
			});
	},
});

export const { setCredentials, logOut } = authSlice.actions;

export const authReducer = authSlice.reducer;

export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
