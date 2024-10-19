import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';
import {setLocalStorage} from '../../utils/localstorage';

export const handleLogin = createAsyncThunk(
	'userLoginSlice/handleLogin',
	async ({email, password, isExternalLogin, isStaffLogin}, {rejectWithValue}) => {
		try {
			const data = await api.post(`/Account/Login`, {
				email,
				password,
				isExternalLogin,
				isStaffLogin,
			});
			console.log(data);

			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const handleLoginStaff = createAsyncThunk(
	'userLoginSlice/handleLoginStaff',
	async ({email, password, isExternalLogin, isStaffLogin}, {rejectWithValue}) => {
		try {
			const data = await api.post(`/Account/LoginStaff`, {
				email,
				password,
				isExternalLogin,
				isStaffLogin,
			});
			console.log(data);

			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const handleStaffRegister = createAsyncThunk(
	'userLoginSlice/handleStaffRegister',
	async ({email, password, fullName, isManager}) => {
		try {
			const data = await api.post(`/Account/RegisterStaff`, {
				email,
				password,
				fullName,
				isManager,
			});
			console.log(data);

			return data;
		} catch (error) {
			console.error(error);
		}
	}
);

export const handleAdminRegister = createAsyncThunk(
	'userLoginSlice/handleAdminRegister',
	async ({email, password, fullName}) => {
		try {
			const data = await api.post(`/Account/RegisterAdmin`, {email, password, fullName});
			console.log(data);

			return data;
		} catch (error) {
			console.error(error);
		}
	}
);

export const getUserDetail = createAsyncThunk(
	'userLoginSlice/getUserDetail',
	async (id, {rejectWithValue}) => {
		try {
			const data = await api.get(`/Account/${id}`);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const userLoginSlice = createSlice({
	name: 'userLoginSlice',
	initialState: {
		userInfo: null,
		userDetail: null,
		loading: null,
		error: null,
	},
	reducers: {
		setUser: (state, action) => {
			state.userInfo = action.payload;
		},
		logout: (state) => {
			state.userInfo = null;
			state.userDetail = null;
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('userId');
			localStorage.removeItem('user');
			localStorage.removeItem('userDetail');
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
				setLocalStorage('accessToken', action.payload.accessToken);
				setLocalStorage('refreshToken', action.payload.refreshToken);
			})
			.addCase(handleLogin.rejected, (state, action) => {
				state.loading = false;
			})
			.addCase(handleLoginStaff.pending, (state, action) => {
				state.loading = true;
			})
			.addCase(handleLoginStaff.fulfilled, (state, action) => {
				state.loading = false;
				state.userInfo = action.payload;
				setLocalStorage('refreshToken', action.payload.refreshToken);
				setLocalStorage('refreshToken', action.payload.refreshToken);
			})
			.addCase(handleLoginStaff.rejected, (state, action) => {
				state.loading = false;
			})
			.addCase(handleStaffRegister.pending, (state, action) => {
				state.loading = true;
			})
			.addCase(handleStaffRegister.fulfilled, (state, action) => {
				state.loading = false;
				state.userInfo = action.payload;
			})
			.addCase(handleStaffRegister.rejected, (state, action) => {
				state.loading = false;
			})
			.addCase(handleAdminRegister.pending, (state, action) => {
				state.loading = true;
			})
			.addCase(handleAdminRegister.fulfilled, (state, action) => {
				state.loading = false;
				state.userInfo = action.payload;
			})
			.addCase(handleAdminRegister.rejected, (state, action) => {
				state.loading = false;
			})
			.addCase(getUserDetail.pending, (state) => {
				state.loading = true;
			})
			.addCase(getUserDetail.fulfilled, (state, action) => {
				state.loading = false;
				state.userDetail = action.payload;
				localStorage.setItem('userDetail', JSON.stringify(action.payload));
			})
			.addCase(getUserDetail.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});
export const {setUser, logout} = userLoginSlice.actions;
