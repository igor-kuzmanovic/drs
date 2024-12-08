import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { userApiSlice } from './userApiSlice';

interface UserState {
	user: {
		id: string;
		email: string;
		firstName: string;
		lastName: string;
		address: string;
		city: string;
		country: string;
		phone: string;
		createdAt: string;
		updatedAt: string;
	} | null;
}

const initialState: UserState = {
	user: null,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
		clearUser: (state) => {
			state.user = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(userApiSlice.endpoints.getUser.matchPending, () => {
				// Noop
			})
			.addMatcher(userApiSlice.endpoints.getUser.matchFulfilled, (state, action) => {
				userSlice.caseReducers.setUser(state, action);
			})
			.addMatcher(userApiSlice.endpoints.getUser.matchRejected, (state) => {
				userSlice.caseReducers.clearUser(state);
			});
	},
});

export const { setUser, clearUser } = userSlice.actions;

export const userReducer = userSlice.reducer;

export const selectUser = (state: RootState) => state.user.user;
