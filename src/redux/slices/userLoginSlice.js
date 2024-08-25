import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';
import {setLocalStorage} from '../../utils/localstorage';

export const handleLogin = createAsyncThunk(
	'userLoginSlice/handleLogin',
	async ({email, password}) => {
		try {
			const data = await api.post(`/login`, {email, password});
			console.log(data);

			return data;
		} catch (error) {
			console.error(error);
		}
	}
);

export const userLoginSlice = createSlice({
	name: 'userLoginSlice',
	initialState: {
		userInfo: {},
		loading: null,
	},
	reducers: {
		setUser: (state, action) => {
			state.userInfo = action.payload;
		},
		logout: (state) => {
			state.userInfo = {}; // or initialState.userInfo;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(handleLogin.pending, (state, action) => {
				state.loading = true;
			})
			.addCase(handleLogin.fulfilled, (state, action) => {
				state.loading = false;
				state.userInfo = action.payload;
				setLocalStorage('token', action.payload.token);
			})
			.addCase(handleLogin.rejected, (state, action) => {
				state.loading = false;
			});
	},
});
