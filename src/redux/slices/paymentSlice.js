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

export const paymentSlice = createSlice({
	name: 'paymentSlice',
	initialState: {
		payment: null,
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
			});
	},
});
