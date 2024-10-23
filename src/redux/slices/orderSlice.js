import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';

export const getAllOrder = createAsyncThunk(
	'userLoginSlice/getAllOrder',
	async (_, {rejectWithValue}) => {
		try {
			const data = await api.get(`/Order/All`);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const getOrderDetail = createAsyncThunk(
	'userLoginSlice/getOrderDetail',
	async (id, {rejectWithValue}) => {
		try {
			const data = await api.get(`/Order/${id}`);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const handleOrderAccept = createAsyncThunk(
	'userLoginSlice/handleOrderAccept',
	async (id, {rejectWithValue}) => {
		try {
			const data = await api.put(`/Order/Accept?orderId=${id}`);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const handleOrderReject = createAsyncThunk(
	'userLoginSlice/handleOrderReject',
	async (id, {rejectWithValue}) => {
		try {
			const data = await api.put(`/Order/Reject?orderId=${id}`);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const handleOrderPreparing = createAsyncThunk(
	'userLoginSlice/handleOrderPreparing',
	async (id, {rejectWithValue}) => {
		try {
			const data = await api.put(`/Order/Preparing?orderId=${id}`);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const handleOrderAddToDelivery = createAsyncThunk(
	'userLoginSlice/handleOrderAddToDelivery',
	async ({orderId, deliveryId}, {rejectWithValue}) => {
		try {
			const data = await api.put(
				`/Order/AddToDelivery?orderId=${orderId}&deliveryId=${deliveryId}`
			);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const handleOrderComplete = createAsyncThunk(
	'userLoginSlice/handleOrderComplete',
	async (id, {rejectWithValue}) => {
		try {
			const data = await api.put(`/Order/Complete?orderId=${id}`);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const orderSlice = createSlice({
	name: 'orderSlice',
	initialState: {
		orders: null,
		orderDetail: null,
		orderStatusDetail: null,
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getAllOrder.pending, (state) => {
				state.loading = true;
			})
			.addCase(getAllOrder.fulfilled, (state, action) => {
				state.loading = false;
				state.orders = action.payload;
			})
			.addCase(getAllOrder.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(getOrderDetail.pending, (state) => {
				state.loading = true;
			})
			.addCase(getOrderDetail.fulfilled, (state, action) => {
				state.loading = false;
				state.orderDetail = action.payload;
				state.orderStatusDetail = action.payload.Status;
			})
			.addCase(getOrderDetail.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleOrderAccept.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleOrderAccept.fulfilled, (state, action) => {
				state.loading = false;
				state.orderDetail = action.payload;
			})
			.addCase(handleOrderAccept.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleOrderReject.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleOrderReject.fulfilled, (state, action) => {
				state.loading = false;
				state.orderDetail = action.payload;
			})
			.addCase(handleOrderReject.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleOrderPreparing.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleOrderPreparing.fulfilled, (state, action) => {
				state.loading = false;
				state.orderDetail = action.payload;
			})
			.addCase(handleOrderPreparing.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleOrderAddToDelivery.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleOrderAddToDelivery.fulfilled, (state, action) => {
				state.loading = false;
				state.orderDetail = action.payload;
			})
			.addCase(handleOrderAddToDelivery.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleOrderComplete.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleOrderComplete.fulfilled, (state, action) => {
				state.loading = false;
				state.orderDetail = action.payload;
			})
			.addCase(handleOrderComplete.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});
