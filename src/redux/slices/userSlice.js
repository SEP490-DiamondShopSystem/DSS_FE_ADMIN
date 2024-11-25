import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';

export const getAllUser = createAsyncThunk('userSlice/getAllUser', async (params) => {
	try {
		const {current, size, roleId, emailStr} = params;
		let url = '/Account/Paging';

		const queryParams = new URLSearchParams();

		if (current) queryParams.append('current', current);
		if (size) queryParams.append('size', size);
		if (roleId) queryParams.append('roleIds', roleId);
		if (emailStr) queryParams.append('emailStr', emailStr);

		if (queryParams.toString()) {
			url += `?${queryParams.toString()}`;
		}

		const data = await api.get(url);

		return data;
	} catch (error) {
		console.error(error);
	}
});

export const handleAddRole = createAsyncThunk(
	'userSlice/handleAddRole',
	async ({accId, roleId}) => {
		try {
			const data = await api.put(`/Account/AddRole`, {
				accId,
				roleId,
			});
			console.log(data);

			return data;
		} catch (error) {
			console.error(error);
		}
	}
);

export const handleRemoveRole = createAsyncThunk(
	'userSlice/handleRemoveRole',
	async ({accId, roleId}) => {
		try {
			const data = await api.put(`/Account/RemoveRole`, {
				accId,
				roleId,
			});
			console.log(data);

			return data;
		} catch (error) {
			console.error(error);
		}
	}
);

export const handleBanAccount = createAsyncThunk('userSlice/handleBanAccount', async (id) => {
	try {
		const data = await api.put(`/Account/Ban?identityId=${id}`);
		console.log(data);

		return data;
	} catch (error) {
		console.error(error);
	}
});

export const getUserAccountDetail = createAsyncThunk(
	'userSlice/getUserAccountDetail',
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

export const getDelivererAccount = createAsyncThunk(
	'userSlice/getDelivererAccount',
	async (_, {rejectWithValue}) => {
		try {
			const data = await api.get(`/Account/DelivererStatus/All`);

			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const userSlice = createSlice({
	name: 'userSlice',
	initialState: {
		users: null,
		userAccount: null,
		delivererList: null,
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getAllUser.pending, (state) => {
				state.loading = true;
			})
			.addCase(getAllUser.fulfilled, (state, action) => {
				state.loading = false;
				state.users = action.payload;
			})
			.addCase(getAllUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleAddRole.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleAddRole.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(handleAddRole.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleRemoveRole.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleRemoveRole.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(handleRemoveRole.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(getUserAccountDetail.pending, (state) => {
				state.loading = true;
			})
			.addCase(getUserAccountDetail.fulfilled, (state, action) => {
				state.loading = false;
				state.userAccount = action.payload;
			})
			.addCase(getUserAccountDetail.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleBanAccount.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleBanAccount.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(handleBanAccount.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(getDelivererAccount.pending, (state) => {
				state.loading = true;
			})
			.addCase(getDelivererAccount.fulfilled, (state, action) => {
				state.loading = false;
				state.delivererList = action.payload;
			})
			.addCase(getDelivererAccount.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export default userSlice.reducer;
