import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';

export const getAllOrder = createAsyncThunk(
	'orderSlice/getAllOrder',
	async (params, {rejectWithValue}) => {
		try {
			const {pageSize, start, Status, CreatedDate, ExpectedDate, Email, IsCustomize} = params;

			let url = '/Order/All';

			const queryParams = new URLSearchParams();

			if (pageSize) queryParams.append('pageSize', pageSize);
			if (start) queryParams.append('start', start);
			if (Status) queryParams.append('Status', Status);
			if (CreatedDate) queryParams.append('CreatedDate', CreatedDate);
			if (ExpectedDate) queryParams.append('ExpectedDate', ExpectedDate);
			if (Email) queryParams.append('Email', Email);
			if (IsCustomize !== null || IsCustomize !== undefined)
				queryParams.append('IsCustomize', IsCustomize);

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

export const handleCheckoutCustomizeOrder = createAsyncThunk(
	'orderSlice/handleCheckoutCustomizeOrder',
	async (body, {rejectWithValue}) => {
		try {
			const data = await api.put(`/CustomizeRequest/Checkout`, body);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const handleRefundOrder = createAsyncThunk(
	'orderSlice/handleRefundOrder',
	async (body, {rejectWithValue}) => {
		try {
			const {OrderId, Amount, TransactionCode, Evidence} = body;

			const formData = new FormData();
			formData.append('OrderId', OrderId);
			formData.append('Amount', Amount);
			formData.append('TransactionCode', TransactionCode);

			// Kiểm tra và thêm tệp nếu nó tồn tại
			if (Evidence && Evidence.length > 0) {
				const file = Evidence[0]?.originFileObj; // Lấy file đầu tiên từ Evidence
				if (file) {
					formData.append('Evidence', file);
				} else {
					console.warn('No valid file found in Evidence');
				}
			}

			const response = await api.post(`/Order/Manager/ConfirmTransfer/Refund`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			return response;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const handleOrderReject = createAsyncThunk(
	'orderSlice/handleOrderReject',
	async ({orderId, reason, IsForUser}, {rejectWithValue}) => {
		try {
			const data = await api.put(
				`/Order/Reject?OrderId=${orderId}&Reason=${reason}&IsForUser=${IsForUser}`
			);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

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

export const handleOrderLogProcessing = createAsyncThunk(
	'orderSlice/handleOrderLogProcessing',
	async ({orderId, message, images}, {rejectWithValue}) => {
		try {
			const formData = new FormData();

			images.forEach((file) => formData.append('images', file));

			formData.append('message', message);

			const data = await api.post(`/Order/Log/${orderId}/Processing`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const handleOrderLogDeliver = createAsyncThunk(
	'orderSlice/handleOrderLogDeliver',
	async ({orderId, message, images}, {rejectWithValue}) => {
		try {
			const formData = new FormData();

			images.forEach((file) => formData.append('images', file));

			formData.append('message', message);

			const data = await api.post(`/Order/Log/${orderId}/Delivering`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const getOrderLog = createAsyncThunk(
	'orderSlice/getOrderLog',
	async (orderId, {rejectWithValue}) => {
		try {
			const response = await api.get(`/Order/Log/${orderId}`);
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const handleRedeliver = createAsyncThunk(
	'orderSlice/handleRedeliver',
	async ({orderId, delivererId}, {rejectWithValue}) => {
		try {
			const response = await api.put(
				`/Order/Redeliver?orderId=${orderId}&delivererId=${delivererId}`
			);
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const handleReturnShop = createAsyncThunk(
	'orderSlice/handleReturnShop',
	async (orderId, {rejectWithValue}) => {
		try {
			const response = await api.put(`/Order/DeliverEnd?orderId=${orderId}`);
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const handleConfirmTransferStaff = createAsyncThunk(
	'orderSlice/handleConfirmTransferStaff',
	async (body, {rejectWithValue}) => {
		try {
			const response = await api.put(`/Order/Staff/ConfirmTransfer/Delivering`, body);
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const handleConfirmTransfer = createAsyncThunk(
	'orderSlice/handleConfirmTransfer',
	async (body, {rejectWithValue}) => {
		try {
			const response = await api.put(`/Order/Staff/ConfirmTransfer/Pending`, body);
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const handleRejectTransfer = createAsyncThunk(
	'orderSlice/handleRejectTransfer',
	async (body, {rejectWithValue}) => {
		try {
			const response = await api.put(`/Order/Staff/RejectTransfer`, body);
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const handleAddMethodInShop = createAsyncThunk(
	'orderSlice/handleAddMethodInShop',
	async (body, {rejectWithValue}) => {
		try {
			const response = await api.post(`/Order/Transaction/Staff/Add`, body);
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const orderSlice = createSlice({
	name: 'orderSlice',
	initialState: {
		orders: null,
		ordersCustomize: null,
		orderDetail: null,
		orderCustomizeDetail: null,
		orderDetailCustomize: null,
		orderStatusDetail: null,
		orderPaymentStatusDetail: null,
		orderStatusCustomizeDetail: null,
		orderPaymentStatusCustomizeDetail: null,
		orderLogsDetail: null,
		orderChildLogDetail: null,
		transfer: null,
		loading: false,
		error: null,
		orderLogs: null,
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
				state.orderDetail = null;
			})
			.addCase(getOrderDetail.fulfilled, (state, action) => {
				state.loading = false;
				state.orderDetail = action.payload;
				state.orderStatusDetail = action.payload.Status;
				state.orderPaymentStatusDetail = action.payload.PaymentStatus;
				state.orderLogsDetail = action.payload.Logs;
			})
			.addCase(getOrderDetail.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			.addCase(handleCheckoutCustomizeOrder.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleCheckoutCustomizeOrder.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(handleCheckoutCustomizeOrder.rejected, (state, action) => {
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
				state.orderLogsDetail = action.payload.Logs;
			})
			.addCase(handleOrderReject.rejected, (state, action) => {
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
				state.orderLogsDetail = action.payload.Logs;
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
				state.orderLogsDetail = action.payload.Logs;
				state.orderPaymentStatusDetail = action.payload.PaymentStatus;
			})
			.addCase(handleRefundOrder.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(getOrderLog.pending, (state) => {
				state.loading = true;
			})
			.addCase(getOrderLog.fulfilled, (state, action) => {
				state.loading = false;
				state.orderLogs = action.payload;
			})
			.addCase(getOrderLog.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleRedeliver.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleRedeliver.fulfilled, (state, action) => {
				state.loading = false;
				// state.orderDetail = action.payload;
				state.orderStatusDetail = action.payload.Status;
				state.orderLogsDetail = action.payload.Logs;
			})
			.addCase(handleRedeliver.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleOrderLogProcessing.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleOrderLogProcessing.fulfilled, (state, action) => {
				state.loading = false;
				state.orderStatusDetail = action.payload.Status;
				state.orderLogsDetail = action.payload.Logs;
				state.orderChildLogDetail = action.payload;
			})
			.addCase(handleOrderLogProcessing.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleOrderLogDeliver.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleOrderLogDeliver.fulfilled, (state, action) => {
				state.loading = false;
				state.orderStatusDetail = action.payload.Status;
				state.orderLogsDetail = action.payload.Logs;
				state.orderChildLogDetail = action.payload;
			})
			.addCase(handleOrderLogDeliver.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleConfirmTransfer.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleConfirmTransfer.fulfilled, (state, action) => {
				state.loading = false;
				state.orderStatusDetail = action.payload.Status;
			})
			.addCase(handleConfirmTransfer.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleConfirmTransferStaff.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleConfirmTransferStaff.fulfilled, (state, action) => {
				state.loading = false;
				state.transfer = action.payload;
			})
			.addCase(handleConfirmTransferStaff.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleRejectTransfer.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleRejectTransfer.fulfilled, (state, action) => {
				state.loading = false;
				state.transfer = action.payload;
			})
			.addCase(handleRejectTransfer.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleAddMethodInShop.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleAddMethodInShop.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(handleAddMethodInShop.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleReturnShop.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleReturnShop.fulfilled, (state, action) => {
				state.loading = false;
				state.transfer = action.payload;
			})
			.addCase(handleReturnShop.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});
