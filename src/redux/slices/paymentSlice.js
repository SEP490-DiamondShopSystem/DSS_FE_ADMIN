import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';

export const getAllPayment = createAsyncThunk(
	'paymentSlice/getAllPayment',
	async (_, {rejectWithValue}) => {
		try {
			const data = await api.get(`/Payment/All`);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const handleOrder = createAsyncThunk(
	'orderSlice/handleOrder',
	async ({id, confirmImages, confirmVideo}, {rejectWithValue}) => {
		try {
			const formData = new FormData();

			// Thêm hình ảnh vào form data
			if (confirmImages) {
				confirmImages.forEach((image, index) => {
					formData.append(`confirmImages`, image);
				});
			}

			// Thêm video vào form data
			if (confirmVideo) {
				formData.append('confirmVideo', confirmVideo);
			}

			const response = await api.put(`/Order/Proceed?orderId=${id}`, formData, {
				headers: {'Content-Type': 'multipart/form-data'},
			});
			return response.data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

export const paymentSlice = createSlice({
	name: 'paymentSlice',
	initialState: {
		payment: null,
		transfer: null,
		completed: null,
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getAllPayment.pending, (state) => {
				state.loading = true;
			})
			.addCase(getAllPayment.fulfilled, (state, action) => {
				state.loading = false;
				state.payment = action.payload;
			})
			.addCase(getAllPayment.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleOrder.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleOrder.fulfilled, (state, action) => {
				state.loading = false;
				state.completed = action.payload;
			})
			.addCase(handleOrder.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});
