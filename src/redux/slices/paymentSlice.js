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

export const handleAddTransfer = createAsyncThunk(
	'paymentSlice/handleAddTransfer',
	async (body, {rejectWithValue}) => {
		try {
			const {OrderId, Evidence} = body;

			const formData = new FormData();

			// Kiểm tra và thêm tệp nếu nó tồn tại
			if (Evidence && Evidence.length > 0) {
				const file = Evidence[0]?.originFileObj; // Lấy file đầu tiên từ Evidence
				if (file) {
					formData.append('Evidence', file);
				} else {
					console.warn('No valid file found in Evidence');
				}
			}

			const response = await api.put(
				`/Order/Deliverer/AddTransfer?OrderId=${OrderId}`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const handleChangeEvidence = createAsyncThunk(
	'paymentSlice/handleChangeEvidence',
	async (body, {rejectWithValue}) => {
		try {
			const {TransactionId, Evidence} = body;

			const formData = new FormData();

			// Kiểm tra và thêm tệp nếu nó tồn tại
			if (Evidence && Evidence.length > 0) {
				const file = Evidence[0]?.originFileObj; // Lấy file đầu tiên từ Evidence
				if (file) {
					formData.append('Evidence', file);
				} else {
					console.warn('No valid file found in Evidence');
				}
			}

			const response = await api.put(
				`/Order/Deliverer/ChangeEvidence?TransactionId=${TransactionId}`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const handleOrder = createAsyncThunk(
	'paymentSlice/handleOrder',
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
			return response;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const handleCompletedOrderAtShop = createAsyncThunk(
	'paymentSlice/handleCompletedOrderAtShop',
	async ({id, confirmerId, confirmImages, confirmVideo}, {rejectWithValue}) => {
		try {
			const formData = new FormData();
			formData.append('orderId', id);
			formData.append('confirmerId', confirmerId);
			// Thêm hình ảnh vào form data
			if (confirmImages) {
				confirmImages.forEach((image, index) => {
					formData.append(`evidences.confirmImages`, image);
				});
			}

			// Thêm video vào form data
			if (confirmVideo) {
				formData.append('evidences.confirmVideo', confirmVideo);
			}

			const response = await api.post(`/Order/Staff/CompleteAtShopOrder`, formData, {
				headers: {'Content-Type': 'multipart/form-data'},
			});
			return response;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
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
			})
			.addCase(handleCompletedOrderAtShop.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleCompletedOrderAtShop.fulfilled, (state, action) => {
				state.loading = false;
				state.completed = action.payload;
			})
			.addCase(handleCompletedOrderAtShop.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleAddTransfer.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleAddTransfer.fulfilled, (state, action) => {
				state.loading = false;
				state.transfer = action.payload;
			})
			.addCase(handleAddTransfer.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleChangeEvidence.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleChangeEvidence.fulfilled, (state, action) => {
				state.loading = false;
				state.transfer = action.payload;
			})
			.addCase(handleChangeEvidence.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});
