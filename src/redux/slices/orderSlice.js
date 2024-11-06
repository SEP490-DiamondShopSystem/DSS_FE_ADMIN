import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';

export const getAllOrder = createAsyncThunk(
	'orderSlice/getAllOrder',
	async (params, {rejectWithValue}) => {
		try {
			const {pageSize, start, Status, CreatedDate, ExpectedDate, Email} = params;

			let url = '/Order/All';

			const queryParams = new URLSearchParams();

			if (pageSize) queryParams.append('pageSize', pageSize);
			if (start) queryParams.append('start', start);
			if (Status) queryParams.append('Status', Status);
			if (CreatedDate) queryParams.append('CreatedDate', CreatedDate);
			if (ExpectedDate) queryParams.append('ExpectedDate', ExpectedDate);
			if (Email) queryParams.append('Email', Email);

			if (queryParams.toString()) {
				url += `?${queryParams.toString()}`;
			}

			const data = await api.get(url);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const getOrderDetail = createAsyncThunk(
	'orderSlice/getOrderDetail',
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

export const getAllOrderCustomize = createAsyncThunk(
	'orderSlice/getAllOrderCustomize',
	async (params, {rejectWithValue}) => {
		try {
			const {currentPage, pageSize} = params;

			let url = '/CustomizeRequest/Staff/All';

			const queryParams = new URLSearchParams();

			if (currentPage) queryParams.append('currentPage', currentPage);
			if (pageSize) queryParams.append('pageSize', pageSize);

			if (queryParams.toString()) {
				url += `?${queryParams.toString()}`;
			}

			const data = await api.get(url);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const getOrderDetailCustomize = createAsyncThunk(
	'orderSlice/getOrderDetailCustomize',
	async (id, {rejectWithValue}) => {
		try {
			const data = await api.get(`/CustomizeRequest/Staff/Detail/${id}`);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const handleOrder = createAsyncThunk(
	'orderSlice/handleOrder',
	async (id, {rejectWithValue}) => {
		try {
			const data = await api.put(`/Order/Proceed?orderId=${id}`);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const handleDeliveryFailed = createAsyncThunk(
	'orderSlice/handleDeliveryFailed',
	async (id, {rejectWithValue}) => {
		try {
			const data = await api.put(`/Order/DeliverFail?orderId=${id}`);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const handleRefundOrder = createAsyncThunk(
	'orderSlice/handleRefundOrder',
	async (id, {rejectWithValue}) => {
		try {
			const data = await api.put(`/Order/CompleteRefund?orderId=${id}`);
			console.log(data);

			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const handleOrderReject = createAsyncThunk(
	'orderSlice/handleOrderReject',
	async ({orderId, reason}, {rejectWithValue}) => {
		try {
			const data = await api.put(`/Order/Reject?orderId=${orderId}&reason=${reason}`);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

// export const handleOrderPreparing = createAsyncThunk(
// 	'orderSlice/handleOrderPreparing',
// 	async (id, {rejectWithValue}) => {
// 		try {
// 			const data = await api.put(`/Order/Preparing?orderId=${id}`);
// 			return data;
// 		} catch (error) {
// 			console.error(error);
// 			return rejectWithValue(error);
// 		}
// 	}
// );

export const handleOrderAssignDeliverer = createAsyncThunk(
	'orderSlice/handleOrderAssignDeliverer',
	async ({orderId, delivererId}, {rejectWithValue}) => {
		try {
			const data = await api.put(
				`/Order/AssignDeliverer?orderId=${orderId}&delivererId=${delivererId}`
			);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

// export const handleOrderComplete = createAsyncThunk(
// 	'orderSlice/handleOrderComplete',
// 	async (id, {rejectWithValue}) => {
// 		try {
// 			const data = await api.put(`/Order/Complete?orderId=${id}`);
// 			return data;
// 		} catch (error) {
// 			console.error(error);
// 			return rejectWithValue(error);
// 		}
// 	}
// );

export const orderSlice = createSlice({
	name: 'orderSlice',
	initialState: {
		orders: null,
		ordersCustomize: null,
		orderDetail: null,
		orderDetailCustomize: null,
		orderStatusDetail: null,
		orderPaymentStatusDetail: null,
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
				state.orderPaymentStatusDetail = action.payload.PaymentStatus;
			})
			.addCase(getOrderDetail.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleOrder.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleOrder.fulfilled, (state, action) => {
				state.loading = false;
				state.orderStatusDetail = action.payload.Status;
			})
			.addCase(handleOrder.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleOrderReject.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleOrderReject.fulfilled, (state, action) => {
				state.loading = false;
				state.orderStatusDetail = action.payload.Status;
				state.orderPaymentStatusDetail = action.payload.PaymentStatus;
			})
			.addCase(handleOrderReject.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleDeliveryFailed.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleDeliveryFailed.fulfilled, (state, action) => {
				state.loading = false;
				state.orderStatusDetail = action.payload.Status;
			})
			.addCase(handleDeliveryFailed.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(getAllOrderCustomize.pending, (state) => {
				state.loading = true;
			})
			.addCase(getAllOrderCustomize.fulfilled, (state, action) => {
				state.loading = false;
				state.ordersCustomize = action.payload;
			})
			.addCase(getAllOrderCustomize.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(getOrderDetailCustomize.pending, (state) => {
				state.loading = true;
			})
			.addCase(getOrderDetailCustomize.fulfilled, (state, action) => {
				state.loading = false;
				state.orderDetailCustomize = action.payload;
			})
			.addCase(getOrderDetailCustomize.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleOrderAssignDeliverer.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleOrderAssignDeliverer.fulfilled, (state, action) => {
				state.loading = false;
				state.orderDetail = action.payload;
				state.orderStatusDetail = action.payload.Status;
			})
			.addCase(handleOrderAssignDeliverer.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleRefundOrder.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleRefundOrder.fulfilled, (state, action) => {
				state.loading = false;
				// state.orderDetail = action.payload;
				state.orderStatusDetail = action.payload.Status;
				state.orderPaymentStatusDetail = action.payload.PaymentStatus;
			})
			.addCase(handleRefundOrder.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});
