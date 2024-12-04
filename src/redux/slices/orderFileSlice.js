import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';

export const fetchOrderFiles = createAsyncThunk(
	'files/fetchOrderFiles',
	async (orderId, {rejectWithValue}) => {
		try {
			const response = await api.get(`/OrderFiles/${orderId}/Files`);
			return response;
		} catch (error) {
			return rejectWithValue(error || error.message);
		}
	}
);

// Slice
export const orderFileSlice = createSlice({
	name: 'orderFileSlice',
	initialState: {
		files: {},
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Fetch Diamond Files
			.addCase(fetchOrderFiles.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchOrderFiles.fulfilled, (state, action) => {
				state.loading = false;
				state.files = action.payload;
			})
			.addCase(fetchOrderFiles.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});
