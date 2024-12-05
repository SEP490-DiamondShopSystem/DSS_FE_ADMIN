import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';

export const getAllDelivery = createAsyncThunk(
	'deliverySlice/getAllDelivery',
	async (_, {rejectWithValue}) => {
		try {
			const data = await api.get(`/Delivery/All`);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const handleCreateDelivery = createAsyncThunk(
	'deliverySlice/handleCreateDelivery',
	async (data, {rejectWithValue}) => {
		try {
			const res = await api.post(`/Delivery/Create`, data);
			return res;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const handleBeginDelivery = createAsyncThunk(
	'deliverySlice/handleBeginDelivery',
	async (_, {rejectWithValue}) => {
		try {
			const res = await api.put(`/Delivery/Begin`);
			return res;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const handleDeliveryFailed = createAsyncThunk(
	'orderSlice/handleDeliveryFailed',
	async ({id, IsShopFault}, {rejectWithValue}) => {
		try {
			const data = await api.put(
				`/Order/DeliverFail?orderId=${id}&IsShopFault=${IsShopFault}`
			);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const deliverySlice = createSlice({
	name: 'deliverySlice',
	initialState: {
		deliveryList: null,
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getAllDelivery.pending, (state) => {
				state.loading = true;
			})
			.addCase(getAllDelivery.fulfilled, (state, action) => {
				state.loading = false;
				state.deliveryList = action.payload;
			})
			.addCase(getAllDelivery.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleCreateDelivery.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleCreateDelivery.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(handleCreateDelivery.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleBeginDelivery.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleBeginDelivery.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(handleBeginDelivery.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleDeliveryFailed.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleDeliveryFailed.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(handleDeliveryFailed.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});
