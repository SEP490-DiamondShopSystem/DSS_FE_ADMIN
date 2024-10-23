import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';

export const getAllUser = createAsyncThunk('userSlice/getAllUser', async ({current, size}) => {
	try {
		const data = await api.get(`/Account/Paging?current=${current}&size=${size}`);
		console.log(data);

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

export const userSlice = createSlice({
	name: 'userSlice',
	initialState: {
		users: null,
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
			});
	},
});

export default userSlice.reducer;
