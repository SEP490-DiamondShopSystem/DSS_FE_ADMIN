import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';

export const getTransactionByOrderId = createAsyncThunk(
	'transactionSlice/getTransactionByOrderId',
	async (id, {rejectWithValue}) => {
		try {
			const response = await api.get(`/Order/${id}/TransactionDetail`);
			return response;
		} catch (error) {
			console.log('Error: ', JSON.stringify(error));
			return rejectWithValue(error);
		}
	}
);

export const transactionSlice = createSlice({
	name: 'transactionSlice',
	initialState: {
		transaction: null,
		promoAble: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getTransactionByOrderId.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getTransactionByOrderId.fulfilled, (state, action) => {
				state.loading = false;
				state.transaction = action.payload;
			})
			.addCase(getTransactionByOrderId.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

// Export actions và reducer
