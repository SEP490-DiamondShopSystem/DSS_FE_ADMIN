import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';

export const getProcessingDetail = createAsyncThunk(
	'orderSlice/getProcessingDetail',
	async ({orderId, logId}, {rejectWithValue}) => {
		try {
			const response = await api.get(`/Order/Log/${orderId}/${logId}/Detail`);
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const getDeliveringDetail = createAsyncThunk(
	'orderSlice/getDeliveringDetail',
	async ({orderId, logId}, {rejectWithValue}) => {
		try {
			const response = await api.get(`/Order/Log/${orderId}/${logId}/Detail`);
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const logSlice = createSlice({
	name: 'logSlice',
	initialState: {
		loading: false,
		error: null,
		orderChildLogList: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder

			.addCase(getProcessingDetail.pending, (state) => {
				state.loading = true;
			})
			.addCase(getProcessingDetail.fulfilled, (state, action) => {
				state.loading = false;
				state.orderChildLogList = action.payload;
			})
			.addCase(getProcessingDetail.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});
