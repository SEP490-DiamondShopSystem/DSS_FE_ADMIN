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

export const handleOrderReject = createAsyncThunk(
	'orderSlice/handleOrderReject',
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
			.addCase(handleOrder.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleOrder.fulfilled, (state, action) => {
				state.loading = false;
				state.orderDetail = action.payload;
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
				state.orderDetail = action.payload;
			})
			.addCase(handleOrderReject.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// .addCase(handleOrderPreparing.pending, (state) => {
			// 	state.loading = true;
			// })
			// .addCase(handleOrderPreparing.fulfilled, (state, action) => {
			// 	state.loading = false;
			// 	state.orderDetail = action.payload;
			// })
			// .addCase(handleOrderPreparing.rejected, (state, action) => {
			// 	state.loading = false;
			// 	state.error = action.payload;
			// })
			.addCase(handleOrderAssignDeliverer.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleOrderAssignDeliverer.fulfilled, (state, action) => {
				state.loading = false;
				state.orderDetail = action.payload;
			})
			.addCase(handleOrderAssignDeliverer.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
		// .addCase(handleOrderComplete.pending, (state) => {
		// 	state.loading = true;
		// })
		// .addCase(handleOrderComplete.fulfilled, (state, action) => {
		// 	state.loading = false;
		// 	state.orderDetail = action.payload;
		// })
		// .addCase(handleOrderComplete.rejected, (state, action) => {
		// 	state.loading = false;
		// 	state.error = action.payload;
		// });
	},
});
