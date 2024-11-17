import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';

export const getOrderCustomizeDetail = createAsyncThunk(
	'orderSlice/getOrderCustomizeDetail',
	async ({RequestId, AccountId}, {rejectWithValue}) => {
		try {
			const data = await api.get(
				`/CustomizeRequest/Staff/Detail?RequestId=${RequestId}&AccountId=${AccountId}`
			);
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
			const {currentPage, pageSize, Email, CreatedDate, ExpiredDate, Status} = params;

			let url = '/CustomizeRequest/Staff/All';

			const queryParams = new URLSearchParams();

			if (currentPage) queryParams.append('currentPage', currentPage);
			if (pageSize) queryParams.append('pageSize', pageSize);
			if (Email) queryParams.append('Email', Email);
			if (CreatedDate) queryParams.append('CreatedDate', CreatedDate);
			if (ExpiredDate) queryParams.append('ExpiredDate', ExpiredDate);
			if (Status) queryParams.append('Status', Status);
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

export const handleCustomizeOrder = createAsyncThunk(
	'orderSlice/handleCustomizeOrder',
	async (body, {rejectWithValue}) => {
		console.log('body', body);

		try {
			const data = await api.put(`/CustomizeRequest/Staff/Proceed`, body);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const handleRejectCustomize = createAsyncThunk(
	'orderSlice/handleRejectCustomize',
	async (id, {rejectWithValue}) => {
		try {
			const data = await api.put(`/CustomizeRequest/Staff/Reject?CustomizeRequestId=${id}`);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const customizeSlice = createSlice({
	name: 'customizeSlice',
	initialState: {
		ordersCustomize: null,
		orderCustomizeDetail: null,
		orderStatusCustomizeDetail: null,
		orderDetailCustomize: null,
		orderPaymentStatusCustomizeDetail: null,
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder

			.addCase(getOrderCustomizeDetail.pending, (state) => {
				state.loading = true;
			})
			.addCase(getOrderCustomizeDetail.fulfilled, (state, action) => {
				state.loading = false;
				state.orderCustomizeDetail = action.payload;
				state.orderStatusCustomizeDetail = action.payload.Status;
				state.orderPaymentStatusCustomizeDetail = action.payload.PaymentStatus;
			})
			.addCase(getOrderCustomizeDetail.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleCustomizeOrder.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleCustomizeOrder.fulfilled, (state, action) => {
				state.loading = false;
				state.orderCustomizeDetail = action.payload;
				state.orderStatusCustomizeDetail = action.payload.Status;
				state.orderPaymentStatusCustomizeDetail = action.payload.PaymentStatus;
			})
			.addCase(handleCustomizeOrder.rejected, (state, action) => {
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
			.addCase(handleRejectCustomize.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleRejectCustomize.fulfilled, (state, action) => {
				state.loading = false;
				state.orderCustomizeDetail = action.payload;
				state.orderStatusCustomizeDetail = action.payload.Status;
			})
			.addCase(handleRejectCustomize.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});
